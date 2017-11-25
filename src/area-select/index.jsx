/**
 * 区域选择器
 */
import React, { Component } from 'react'
import Select from '../select'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './index.less'

class AreaSelect extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,  // ({province: a, city: b, area: c})
    provinceOptions: PropTypes.array,
    cityOptions: PropTypes.array,
    areaOptions: PropTypes.array
  }

  static defaultProps = {
    provinceOptions: [],
    cityOptions: [],
    areaOptions: []
  }

  state = {
    province: '',  // 省
    city: '',  // 市
    area: ''  // 区
  }

  /**
   * 设置 省市县的值
   * @param {String} type province city area
   * @param {String} value 
   */
  _setValue(type, value) {
    let nState
    if(type === 'province') {
      nState = {
        province: value,
        city: '',
        area: ''
      }
    } else if(type === 'city') {
      nState = {
        city: value,
        area: ''
      }
    } else {
      nState = {
        area: value
      }
    }
    
    this.setState({
      ...nState
    }, () => {
      const { province, city, area } = this.state
      const result = {
        province,
        city,
        area
      }
      this.doOnChange(result, type)
    })
  }

  onChangeHandler(type, value) {
    this._setValue(type, value)
  }

  /**
   * 回传数据
   * @param {*} value 
   */
  doOnChange(value, type) {
    this.props.onChange && this.props.onChange(value, type)
  }

  render() {
    const { className, style, provinceOptions, cityOptions, areaOptions } = this.props
    const { province, city, area } = this.state

    return (
      <div className={classnames("mpc-aselect", className)}
        style={style}>
        {/*省*/}
        <Select className="mpc-aselect_select-province"
          placeholder="--省--"
          value={province}
          options={provinceOptions}
          onChange={(value) => {
            this.onChangeHandler('province', value)
          }}></Select>

        {/*市*/}
        <Select className="mpc-aselect_select-city"
          placeholder="--城市--"
          value={city}
          onChange={(value) => {
            this.onChangeHandler('city', value)
          }}
          options={cityOptions}></Select>

        {/*区*/}
        <Select className="mpc-aselect_select-area"
          placeholder="--区/县--"
          value={area}
          onChange={(value) => {
            this.onChangeHandler('area', value)
          }}
          options={areaOptions}></Select>
      </div>
    )
  }
}

export default AreaSelect