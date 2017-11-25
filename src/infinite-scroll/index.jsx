/**
 * 无限滚动组件
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class InfiniteScroll extends Component {
  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,  // 高度 e.g: 100px || 100
    isAuto: PropTypes.bool,  // 首次加载是否触发回调
    onBottom: PropTypes.func,  // 触底时触发的回调 (): Promise，需要返回一个Promise, Promise resolve(isEnd)，回传为true则之后不再触发onBottom
    offsetTop: PropTypes.number,  // 预加载距离
    delay: PropTypes.number  // 触发延时
  }

  static defaultProps = {
    offsetTop: 20,
    delay: 100
  }

  timer = null
  isRun = true  // 是否开启检测

  constructor(props) {
    super(props)

    this.onScroll = this.onScroll.bind(this)
  }

  /**
   * 触发回调
   */
  async _triggerCallback() {
    const onBottom = this.props.onBottom
    if (!onBottom) return

    this.isRun = false  // 在等待一个回调的完成的时候，先关闭探测器
    const isStop = await onBottom()
    
    this.isRun = !isStop
  }

  /**
   * 检测是否触底
   */
  isBottom() {
    const ctn = this.container
    const offset = this.props.offsetTop
    const offsetHeight = ctn.offsetHeight
    const scrollTop = ctn.scrollTop
    const scrollHeight = ctn.scrollHeight

    return (offset + scrollTop + offsetHeight) >= scrollHeight
  }

  /**
   * onscroll的回调
   */
  onScroll() {
    if(this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }

    this.timer = window.setTimeout(this.doOnScroll.bind(this), this.props.delay)
  }

  doOnScroll() {
    if(this.isBottom() && this.isRun) {
      this._triggerCallback()
    }
  }

  addScrollListener() {
    this.container.addEventListener('scroll', this.onScroll)
  }

  componentDidMount() {
    if(this.props.isAuto) {
      this.doOnScroll()
    }

    this.addScrollListener()
  }

  render() {
    const { height, children } = this.props

    return (
      <div className="mpc-inscroll"
        ref={(dom) => {
          this.container = dom
        }}
        style={{
          overflowY: 'auto',
          height: typeof height === 'number' ? (height + 'px') : height
        }}>
        {children}
      </div>
    )
  }
}

export default InfiniteScroll