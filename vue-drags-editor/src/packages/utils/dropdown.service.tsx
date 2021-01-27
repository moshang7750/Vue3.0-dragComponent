import { computed, createApp, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, PropType, reactive, ref } from "vue";
import { defer } from "./defer";
import './drowdown-service.scss'
interface DropdownServiceOption{
    reference: MouseEvent | HTMLElement,
    content: () => JSX.Element
}
const ServiceComponent = defineComponent({
  props: {
      option:  { type: Object as  PropType<DropdownServiceOption>, required: true}
  },
  setup(props){
    const ctx  = getCurrentInstance()!
    const el = ref({} as HTMLDivElement)
    const state =  reactive({
        option: props.option,
        showFlag: false,
        top: 0,
        left: 0,
        mounted: (() => {
            const dfd = defer()
            onMounted(() => {
               setTimeout(() =>  dfd.resolve(), 0)
            })
            return dfd.promise
        })()
    })
    const service  = (option:  DropdownServiceOption) => {
        state.option  = option
        if('addEventListener' in option.reference)  {
            const {top,left, height}  = option.reference.getBoundingClientRect()
            state.top = top + height
            state.left = left
        }  else  {
            const {clientX, clientY}  = option.reference
            state.top = clientY 
            state.left = clientX
        }
        methods.show()

    }
    const methods = {
        show: async ()  => {
            await state.mounted
            state.showFlag  = true
        },
        hide: () => {
            state.showFlag  = false

        }
    }
    const  classes = computed(() => [
        'dropdown-service',
        {
            'dropdown-service-show': state.showFlag 
        }
    ])
    const styles =  computed(() => ({
        top: `${state.top}px`,
        left: `${state.left}px`,
    }))
    Object.assign(ctx.proxy, {service})

    const onMousedownDocument = (e: MouseEvent) => {
        if(!(el.value.contains(e.target as HTMLElement))) {
            methods.hide()
        }
    }
    onMounted(()=> document.addEventListener('click', onMousedownDocument,  true));
    onBeforeUnmount(() => document.removeEventListener('click', onMousedownDocument,  true))
    
    return  () => (
        <div class={classes.value}  style={styles.value} ref={el}>
            {state.option.content()}
        </div>
    )
  }
})

export const DropdownOption = defineComponent({
    props: {
        label: { type:  String},
        icon: { type:  String}
    },
    setup(props){
        return ()=> (
            <div class="dropdown-service-option" >
                <i class={`iconfont ${props.icon}`}></i>
                <span>{props.label}</span>
            </div>
        ) 
    }
})

export const $$dropdown = (() => {
    let ins: any
    return (option: DropdownServiceOption)  =>{
        if(!ins)  {
            const el  =  document.createElement('div')
            document.body.appendChild(el)
            const app = createApp(ServiceComponent,{option})
            ins  = app.mount(el)
         }
         ins.service(option)
    }
})()