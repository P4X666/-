import loadingVue from "./loading.vue";
import { h, render } from "vue";

const MOUNT_COMPONENT_REF = "el_component";
const COMPONENT_CONTAINER_SYMBOL = Symbol("el_component_container");

/**
 * 创建组件实例对象
 * 返回的实例和调用 getCurrentComponent() 返回的一致
 * @param {*} Component
 */
function createComponent(Component: any, props: any, children: any) {
    const vnode: any = h(Component, { ...props, ref: MOUNT_COMPONENT_REF }, children)
    const container = document.createElement('div')
    vnode[COMPONENT_CONTAINER_SYMBOL] = container
    render(vnode, container)
    return vnode.component
}

/**
 * 销毁组件实例对象
 * @param {*} ComponnetInstance 通过createComponent方法得到的组件实例对象
 */
function unmountComponent(ComponnetInstance: any) {
    render(null, ComponnetInstance.vnode[COMPONENT_CONTAINER_SYMBOL])
}
const hasClass = function (obj:any, cls:string) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
const removeClass = function (obj: any, cls: string) {
    if (hasClass(obj, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        obj.className = obj.className.replace(reg, ' ')
    }
}
function addClass(el:any, cls:string) {
    if (!el) return
    let curClass = el.className
    const classes = (cls || '').split(' ')
  
    for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i]
      if (!clsName) continue
  
      if (el.classList) {
        el.classList.add(clsName)
      } else if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
    if (!el.classList) {
      el.className = curClass
    }
  }
const addStyle = (options:any, parent:any, ctx:any) => {
    const maskStyle:any = {}
    if (options.fullscreen) {
      addClass(ctx.$el, 'is-fullscreen')
    } else if (options.body) {
    //   removeClass(ctx.$el, 'is-fullscreen')
            ;
    //     ['top', 'left'].forEach((property) => {
    //     const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft'
    //     maskStyle[property] =
    //       options.target.getBoundingClientRect()[property] + //         document.body[scroll] +
    //       document.documentElement[scroll] +
    //       'px'
    //   })
    //   ;['height', 'width'].forEach((property) => {
    //     maskStyle[property] =
    //       options.target.getBoundingClientRect()[property] + 'px'
    //   })
    } else {
    //   ctx.originalPosition = getStyle(parent, 'position')
    }
    // Object.keys(maskStyle).forEach((property) => {
    //   ctx.$el.style[property] = maskStyle[property]
    // })
  
    if (ctx.originalPosition !== 'absolute' && ctx.originalPosition !== 'fixed') {
      addClass(parent, 'el-loading-parent--relative')
    }
  
    if (options.fullscreen && options.lock) {
      addClass(parent, 'el-loading-parent--hidden')
    }
  }
    const defaults: object = {
        target: null,
        body: false,
        fullscreen: true,
        lock: false,
        text: null,
        spinner: null,
        background: null,
        customClass: ''
    }
    let fullscreenLoading: null | object
    const Loading = (options: any) => {
        // if (Vue.prototype.$isServer) return
        options = Object.assign({}, defaults, options)

        if (typeof options.target === 'string') {
            options.target = document.querySelector(options.target)
        }
        options.target = options.target || document.body
        if (options.target !== document.body) {
            options.fullscreen = false
        } else {
            options.body = true
        }

        if (options.fullscreen && fullscreenLoading) {
            return fullscreenLoading
        }

        const parent = options.body ? document.body : options.target
        const instance = createComponent(loadingVue, {
            ...options,
            visible: true,
            onAfterLeave() {
                if (options.fullscreen) {
                    fullscreenLoading = null
                }
                const target =
                    options.fullscreen || options.body ? document.body : options.target
                removeClass(target, 'el-loading-parent--relative')
                removeClass(target, 'el-loading-parent--hidden')
                unmountComponent(instance)
            }
        }, null)
        addStyle(options, parent, instance.ctx)

        parent.appendChild(instance.ctx.$el)

        if (options.fullscreen) {
            fullscreenLoading = instance
        }

        instance.close = function () {
            this.ctx.close()
        }
    

        return instance
    }

export default Loading