/**
 * 下拉选择器
 */
import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './index.less'

class Select extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,  //当前的value
    options: PropTypes.array.isRequired,  // [{text: 显示的文字, value: 真实value}]
    placeholder: PropTypes.string,  // 占位文字
    onChange: PropTypes.func  // 进行选择后的回调
  }

  static defaultProps = {
    placeholder: '--请选择--'
  }

  state = {
    status: 'deactive',  // deactive normal active
    value: this.props.value || ''
  }

  constructor(props) {
    super(props)

    this.onDocumentClick = this.onDocumentClick.bind(this)
  }

  _active() {
    this.setState({
      status: 'active'
    })
  }

  _deactive() {
    this.setState({
      status: 'deactive'
    })
  }

  _normal() {
    this.setState({
      status: 'normal'
    })
  }

  /**
   * option被选择后的回调
   * @param {String} value 
   * @param {Boolean} triggerOnChange 是否回传数据，触发onChange
   */
  _onSelect(value, triggerOnChange = true) {
    this.setState({
      value
    })

    if(value === '') {
      this._deactive()
    } else {
      this._normal()
    }

    if(triggerOnChange) {
      this.doOnChange(value)
    }
  }

  /**
   * 回传数据
   * @param {String} value 
   */
  doOnChange(value) {
    if(value !== this.state.value) {
      this.props.onChange && this.props.onChange(value)
    }
  }

  getSelectedText() {
    const value = this.state.value

    if(value === '') {
      return this.props.placeholder
    }

    return this.props.options.find((option) => {
      return option.value === value
    }).text
  }

  toggleStatus(e) {
    const { status } = this.state

    if (status === 'deactive' || status === 'normal') {
      this._active()
    } else {
      this._normal()
    }
  }

  onDocumentClick(e) {
    if (this.state.status === 'active') {
      this._normal()
    }
  }

  componentWillReceiveProps(nextProps) {
    const nValue = nextProps.value
    if(nValue !== undefined && nValue !== this.state.value) {
      this._onSelect(nValue, false)
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
  }

  render() {
    const { status } = this.state
    const { className, style, options } = this.props

    return (
      <div className={classnames("mpc-select", className)}
        style={style}
        onClick={(e) => {
          // 捕获元素内部的click，不让其冒泡到document
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
        }}>
        {/*文字显示部分*/}
        <div className={classnames("mpc-select_text", status)}
          onClick={this.toggleStatus.bind(this)}>
          <span className="mpc-select_text-span">{this.getSelectedText()}</span>
          <i className="mpc-select_triangle"></i>
        </div>

        {/*下拉面板*/}
        {status === 'active' ? (
          options.length > 0 ? (
          <ul className="mpc-select_panel">
            {this.props.options.map((option) => (
              <li key={option.value}
                className={classnames(
                  "mpc-select_panel-item",
                  { 'active': option.value === this.state.value }
                )}
                onClick={() => {
                  this._onSelect(option.value)
                }}>{option.text}</li>
            ))}
          </ul>
          ): (
            <ul className="mpc-select_panel">
              <li className="mpc-select_panel-item">无</li>
            </ul>
          ) 
        ) : null}
      </div>
    )
  }
}

export default Select