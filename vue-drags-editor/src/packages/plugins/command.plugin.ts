import { reactive, onUnmounted } from 'vue';
import { KeyboardCode } from './keyboard-code';

export interface CommandExecute {
    undo?: () => void,
    redo: () => void
}

export interface Command {
    name: string,                                    // 命令名称
    execute: (...args: any[]) => CommandExecute,     // 命令执行的逻辑,
    keyboard?: string | string[],                    // 命令被执行的时候，所做的内容
    followQueue?: boolean,                       // 是否遵循命令队列
    init?: any,
    data?: any,
    destoty?: () => void,
}

export function useCommander() {
    const state = reactive({
        current: -1,                                                    // 队列中当前的命令
        queue: [] as CommandExecute[],                                  // 命令队列
        commandArray: [] as Command[],                                  //  命令对象数组
        commands: {} as Record<string, (...args: any[]) => void>,       // 命令对象， 方便通过名称执行execute函数
        destoryList: [] as any // ((() => void) | undefined)[]
    })
    // 注册命令
    const registry = (command: Command) => {
        state.commandArray.push(command)
        state.commands[command.name] = (...args) => {
            const { undo, redo } = command.execute(...args)
            redo()
            if (command.followQueue === false) {
                return
            }
            let { queue, current } = state
            if (queue.length > 0) {
                queue = queue.slice(0, current + 1)
                state.queue = queue
            }
            queue.push({ undo, redo })
            state.current = current + 1;
        }
    }
    const keyboardEvent = (() => {
        const onKeydown = (e: KeyboardEvent) => {
            if (document.activeElement !== document.body) return
            const { keyCode, shiftKey, altKey, ctrlKey, metaKey } = e
            let keyString: string[] = []
            if (ctrlKey || metaKey) keyString.push('ctrl')
            if (shiftKey) keyString.push('shift')
            if (altKey) keyString.push('alt')
            KeyboardCode[keyCode] && keyString.push(KeyboardCode[keyCode])
            const keyNames = keyString.join('+')
            state.commandArray.forEach(item => {
                let { keyboard, name } = item
                if (!keyboard) return
                const keys = Array.isArray(keyboard) ? keyboard : [keyboard]
                keys.forEach(key => {
                    if (key == keyNames) {
                        console.log(keyNames, name)
                        state.commands[name]()
                        e.stopPropagation()
                        e.preventDefault()
                    }
                })
            })

        }
        const init = () => {
            window.addEventListener('keydown', onKeydown)
            return () => {
                window.removeEventListener('keydown', onKeydown)
            }
        }
        return init
    })();

    // useCommander 初始化 函数，负责初始化键盘的监听事件，调用命令的 初始化逻辑
    const init = function () {
        const onKeydown = (e: KeyboardEvent) => {
            // console.log('1111')
        }
        window.addEventListener('keydown', onKeydown)
        state.commandArray.forEach(command => !!command.init && state.destoryList.push(command.init()))
        state.destoryList.push(keyboardEvent())
        state.destoryList.push(() => window.removeEventListener('keydown', onKeydown))
    }
    //  注册撤销命令 (撤回命令执行结果不需要进入命令队列 )
    registry({
        name: 'undo',
        keyboard: 'ctrl+z',
        followQueue: false,
        execute: () => {
            // 命令被执行的时候，要做的事情
            return {
                redo: () => {
                    if (state.current === -1) {
                        return
                    }
                    const queueItem = state.queue[state.current]
                    if (!!queueItem) {
                        !!queueItem.undo && queueItem.undo()
                        state.current--
                    }
                }

            }
        }
    })
    //  注册 重做命令  (重做命令执行结果不需要进入命令队列)
    registry({
        name: 'redo',
        keyboard: ['ctrl+shift+z', 'ctrl+y'],
        followQueue: false,
        execute: () => {
            // 命令被执行的时候，要做的事情
            return {
                redo: () => {
                    const queueItem = state.queue[state.current + 1]
                    if (!!queueItem) {
                        queueItem.redo()
                        state.current++
                    }

                },
            }
        }
    })
    onUnmounted(() => {
        state.destoryList.forEach((fn: () => any) => !!fn && fn())
    })
    return {
        state,
        registry,
        init
    }
}
