import { reactive } from 'vue';

export interface CommandExecute {
    undo?: () => void,
    redo: () => void
}

export interface Command {
    name: string,                                    // 命令名称
    execute: (...args: any[]) => CommandExecute,     // 命令执行的逻辑,
    keyboard?: string | string[],                    // 命令被执行的时候，所做的内容
    followQueue?: boolean                            // 是否遵循命令队列
}


export function useCommander() {
    const state = reactive({
        current: -1,
        queue: [] as CommandExecute[],
        commands: {} as Record<string, (...args: any[]) => void>
    })

    const registry = (command: Command) => {
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
    registry({
        name: 'undo',
        keyboard: 'ctrl+z',
        followQueue: false,
        execute: () => {
            // 命令被执行的时候，要做的事情
            return {
                redo: () => {
                    // 重新做一遍，要做的事情
                    if (state.current < 0) return
                    const queueItem = state.queue[state.current]
                    if (!!queueItem) {
                        !!queueItem.undo && queueItem.undo()
                        state.current--
                    }
                }

            }
        }
    })
    registry({
        name: 'redo',
        keyboard: ['ctrl+shift+z', 'ctrl+y'],
        followQueue: false,
        execute: () => {
            // 命令被执行的时候，要做的事情
            return {
                redo: () => {
                    // 重新做一遍，要做的事情
                    const queueItem = state.queue[state.current + 1]
                    if (!!queueItem) {
                        queueItem.redo()
                        state.current++
                    }

                },
            }
        }
    })
    return {
        state,
        registry
    }
}
