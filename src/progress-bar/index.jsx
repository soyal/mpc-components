/**
 * 播放器的进度条
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

class ProgressBar extends Component {
  isLock = true  // 为true的情况，不响应mouse move
  startX = 0  // move enter 记录的起始坐标
  ctn = null  // container dom
  pointFix = 4  // 要考虑小球的宽度，所以显示的时候会在实际的坐标基础上往左挪一点
  isDomLoaded = false  // ctn是否安装

  static propTypes = {
    className: PropTypes.string,  // 类名
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),  // 宽度
    max: PropTypes.number,  // value最大值
    value: PropTypes.number,  // value
    loadedValue: PropTypes.number,  // 已经加载的value
    loadBarColor: PropTypes.string,  // load条的颜色
    playBarColor: PropTypes.string,  // 播放条的颜色
    defaultBarColor: PropTypes.string,  // 底层的bar颜色
    pointStyle: PropTypes.object,  // 点的样式
    onChange: PropTypes.func,  // 选择了进度后的回调
    onDragStart: PropTypes.func,  //开始拖拽进度的回调
    onDragEnd: PropTypes.func  // 结束拖拽的回调
  }

  static defaultProps = {
    width: 200,
    value: 0,
    loadedValue: 0,
    max: 100,
    loadBarColor: '#dedede',
    playBarColor: '#bdd5d0',
    defaultBarColor: '#f1f1f1',
    pointStyle: {
      border: '1px solid #bdd5d0',
      background: '#fff'
    }
  }

  state = {
    pointX: 0  // 可拖拽的点的 x 坐标
  }

  constructor(props) {
    super(props)

    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
  }

  /**
   * 将pointX转换成value
   */
  _transferP2V(pointX) {
    const { max } = this.props
    const width = this._getWidth()
    // 调用回调
    const value = (pointX / width) * max
  
    return Math.floor(value)
  }

  /**
   * 将value转换成pointX
   */
  _transferV2P(value) {
    const { max } = this.props
    const width = this._getWidth()

    const targetX = (value / max) * width

    return targetX
  }

  _doOnChange(targetX) {
    if (!this.props.onChange) return

    this.props.onChange(this._transferP2V(targetX))
  }

  /**
   * 开始拖拽
   */
  _onDragStart() {
    const nds = this.props.onDragStart
    nds && nds()
  }

  _onDragEnd() {
    const nde = this.props.onDragEnd
    nde && nde()
  }

  /**
   * 移动point
   * @param {Number} targetX 目标left坐标
   */
  doMove(targetX) {
    const maxX = this._getWidth()

    if (targetX < 0) {
      targetX = 0
    } else if (targetX > maxX) {
      targetX = maxX
    }

    this.setState({
      pointX: targetX
    })

    return targetX
  }

  _getWidth() {
    const { width } = this.props
  
    if(typeof width === 'number') {
      return this.props.width
    } else {
      // ctn已经安装 返回实际的宽度，没有的话就返回0
      if(this.isDomLoaded) {
        const rect = this.ctn.getBoundingClientRect()
        return rect.width
      } else {
        return 0
      }
    }
  }

  _startMove(e) {
    this.isLock = false
    this.startX = e.clientX
    this._onDragStart()
  }

  _endMove(e) {
    this.isLock = true
    this.startX = 0
    const targetX = this.state.pointX
    this._doOnChange(targetX)
    this._onDragEnd()
  }

  _move(e) {
    // 检测鼠标是否滑出progress区域
    const deviation = 10  // 不会严格划定progress区域，允许的偏差值
    const rect = this.ctn.getBoundingClientRect()
    const offsetLeft = rect.left - deviation  // 左侧距窗口左侧的距离
    const offsetRight = rect.left + rect.width + deviation  // 右侧距窗口左侧的距离
    const mouseClientX = e.clientX
    if (mouseClientX < offsetLeft ||
      mouseClientX > offsetRight) {
      return
    }

    const diffX = mouseClientX - this.startX
    let nPointX = this.state.pointX + diffX

    // const targetX = this.doMove(nPointX)
    // this._doOnChange(targetX)
    this.doMove(nPointX)

    this.startX = mouseClientX
  }

  _onMouseDown(e) {
    e.preventDefault()
    // 只有点下左键才反应
    if (e.button !== 0) return

    this._startMove(e)
  }

  _onMouseMove(e) {
    e.preventDefault()
    // 只有点下左键才反应
    if (e.button !== 0 || this.isLock) return

    this._move(e)
  }

  _onMouseUp(e) {
    e.preventDefault()
    // 只有点下左键才反应
    if (e.buttons !== 0 || this.isLock) return

    this._endMove(e)
  }

  _onBarClick(e) {
    const rect = this.ctn.getBoundingClientRect()
    const nPointX = e.clientX - rect.left
    const targetX = this.doMove(nPointX)

    this._doOnChange(targetX)
  }

  componentWillReceiveProps(nextProps) {
    const nValue = nextProps.value
    
    if(nValue !== undefined && nValue !== this.props.value) {
      this.doMove(this._transferV2P(nValue))
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mouseup', this._onMouseUp)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('mouseup', this._onMouseUp)
  }

  render() {
    const { className, width, loadedValue, loadBarColor, playBarColor, defaultBarColor } = this.props
    const { pointX } = this.state
    return (
      <div className={classnames("mpc-progress-bar_wrap", className)}>
        <div className={"mpc-progress-bar"}
          ref={(dom) => {
            if(dom) {
              this.ctn = dom
              this.isDomLoaded = true
            }
          }}
          style={{
            width: typeof width === 'number' ? (width + 'px') : width
          }}>
          <div className="mpc-progress-bar_bar"
            style={{
              backgroundColor: defaultBarColor
            }}
            onClick={this._onBarClick.bind(this)}>
            {/*加载进度条*/}
            <div className="mpc-progress-bar_bar-load"
              style={{
                backgroundColor: loadBarColor,
                width: this._transferV2P(loadedValue) + 'px'
              }}></div>
            {/*播放进度条*/}
            <div className="mpc-progress-bar_bar-play"
              style={{
                backgroundColor: playBarColor,
                width: pointX
              }}></div>
          </div>
          {/*可拖拽的点*/}
          <span className="mpc-progress-bar_point"
            style={{
              left: (pointX - this.pointFix) + 'px',
              ...this.props.pointStyle
            }}
            onMouseDown={this._onMouseDown.bind(this)}
            onDrag={() => {
              return false
            }}
            onDragStart={() => {
              return false
            }}
            onDragEnd={() => {
              return false
            }}></span>
        </div>
      </div>

    )
  }
}

export default ProgressBar