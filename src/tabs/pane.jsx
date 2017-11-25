/**
 * tab面板
 */
import React from 'react'
import PropTypes from 'prop-types'

import './pane.less'

const Pane = ({ children }) => {
  return (
    <div className="home-page_tp-item">{children}</div>
  )
}

Pane.propTypes = {
  activeKey: PropTypes.string.isRequired,  // Pane对应的key
  tab: PropTypes.string.isRequired  //Pane对应的显示文字
}

export default Pane