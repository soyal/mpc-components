import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import './tab.less'

class Tab extends Component {

  chiildren = null

  static propTypes = {
    activeKey: PropTypes.string,  // 当前激活的面板的activeKey
    onChange: PropTypes.func,  // 点击tab进行切换后的回调
    className: PropTypes.string,  // 自定义类名
    style: PropTypes.object  // 自定义style
  }

  constructor(props) {
    super(props)

    this.children = this._getChildren(props.children)
  }

  _getChildren(children) {
    if (children.length === 1) {
      children = [children]
    }

    return children.map((child) => ({
      tab: child.props.tab,
      activeKey: child.props.activeKey
    }))
  }

  render() {
    const { activeKey, onChange, className, style } = this.props

    return (
      <div className={classnames("home-page_tabs", className)}
        style={style}>
        {/* tab头部 */}
        <ul className="home-page_tabs-tab">
          {this.children.map((child) => (
            <li key={child.activeKey}
              onClick={() => {
                onChange && onChange(child.activeKey)
              }}
              className={classnames(
                "home-page_tt-item",
                { 'active': child.activeKey === activeKey }
              )}>{child.tab}</li>
          ))}
        </ul>

        {/* tab面板 */}
        <div className="home-page_tabs-pane">
          {
            this.props.children.length > 0 ?
              this.props.children.find((child) => {
                return child.props.activeKey === activeKey
              }) :
              this.props.children
          }
        </div>
      </div>
    )
  }
}

export default Tab