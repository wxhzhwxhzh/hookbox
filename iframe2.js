const copyToClipboard=(text) =>{
    // 存储到数组
    
    // 创建一个隐藏的 textarea 元素
    const textarea = document.createElement('textarea');
    
    // 将待复制的文本设置为 textarea 的值
    textarea.value = text;

    // 将 textarea 元素加入到 DOM 中
    document.body.appendChild(textarea);

    // 选中 textarea 中的文本
    textarea.select();
    
    // 执行复制操作
    try {
        document.execCommand('copy');
        console.log('Text copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }

    // 复制后移除 textarea 元素
    document.body.removeChild(textarea);
};



const inintCode=`

window.hook_logs = []; // 用于存储日志的数组
// Hook工具集对象
const HookBoxs = {
    // JSON.parse的Hook功能
    JSONParse: {
        // 存储原始的JSON.parse方法
        originalMethod: null,
        logs: [], // 用于存储日志的数组

        hook(debug = false, include = "",backToOriginal = false) {
            if (backToOriginal) {
                this.unhook();
                return;
            }
            // 如果已经Hook过，先取消旧的Hook
            if (this.originalMethod !== null) {
                this.unhook();
            }

            // 保存原始方法
            this.originalMethod = JSON.parse;

            // 替换JSON.parse方法
            JSON.parse = (params) => {
                if (include.length == 0 || params.includes(include)) {
                    console.log("Hook JSON.parse =>", params);
                    hook_logs.push(params); // 将参数添加到日志数组中

                    if (debug) {
                        debugger; // 触发调试器
                    }
                }

                // 调用原始方法并确保正确的this上下文
                return this.originalMethod.call(JSON, params);
            };

            console.log('JSON.parse已被Hook');
        },

        unhook() {
            // 检查是否已经Hook过
            if (this.originalMethod === null) {
                console.warn('JSON.parse尚未被Hook');
                return;
            }

            // 恢复原始方法
            JSON.parse = this.originalMethod;
            this.originalMethod = null;

            console.log('JSON.parse已恢复');
        },
    },

    // 新增的JSONStringify Hook功能
    JSONStringify: {
        originalMethod: null,
        logs:[],

        hook(debug = false, include = "",backToOriginal = false) {
            if (backToOriginal) {
                this.unhook();
                return; 
            }
            if (this.originalMethod !== null) {
                this.unhook();
            }

            this.originalMethod = JSON.stringify;

            JSON.stringify = (...args) => {
                const result = this.originalMethod.apply(JSON, args);
                const resultString = String(result);

                if (include.length === 0 || resultString.includes(include)) {
                    console.log("Hook JSON.stringify =>", result);

                    hook_logs.push(resultString); // 将结果添加到日志数组中
                    if (debug) {
                        debugger;
                    }
                }

                return result;
            };

            console.log('JSON.stringify已被Hook');
        },

        unhook() {
            if (this.originalMethod === null) {
                console.log('JSON.stringify尚未被Hook');
                return;
            }

            JSON.stringify = this.originalMethod;
            this.originalMethod = null;
            console.log('JSON.stringify已恢复');
        },
    }
};


`



const toJSCode=(jsonObj)=>{   
    const cmd= Object.values(jsonObj).join("\n");    
    const jscode=inintCode+cmd;
    return jscode;
}
const toDrissionPageCode=(jsonObj)=>{   
    let a=toJSCode(jsonObj);
    a=`
hook_code='''${a}'''
tab.add_init_js(hook_code)
# 想要获取hook的日志结果请使用  print(tab.run_js("return hook_logs;"))
    
    `
    return a;
}