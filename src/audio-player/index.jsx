/**
 * 音频播放器
 */
import React, { Component } from 'react'
import ProgressBar from '../progress-bar'
import PropTypes from 'prop-types'
import { formatAudioTime } from 'utils/time'
import classnames from 'classnames'

import './index.less'

class AudioPlayer extends Component {
  dom = null  // 音频dom
  canPlay = false  // 是否能播放

  static propTypes = {
    url: PropTypes.string  // 音频url地址
  }

  state = {
    isPlayed: false,  // 音频是否正在播放
    currentTime: 0,  // 当前播放到的时间(s)
    duration: 0,  // 音频总时长(s)
    loadedTime: 0  // 已加载的时间
  }

  /**
   * 播放音频
   */
  play() {
    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  toggleAudio() {
    const isPlayed = this.state.isPlayed
    if(isPlayed) {
      this.pause()
    } else {
      this.play()
    }
  }

  onPlay() {
    this.setState({
      isPlayed: true
    })
  }

  onPause() {
    this.setState({
      isPlayed: false
    })
  }

  /**
   * 设置播放器的播放进度
   */
  setCurrentTime(nCurrentTime) {
    this.audio.currentTime = nCurrentTime
    this._updateCurrentTime()
  }

  /**
   * 更新state上的currentTime
   */
  _updateCurrentTime() {
    const nCurrentTime = this.audio.currentTime
    
    this.setState({
      currentTime: parseInt(nCurrentTime, 10)
    })
  }

  /**
   * 音频onProgress的回调
   */
  _onProgress() {
    const buffered = this.audio.buffered
    if(buffered.length > 0) {
      this.setState({
        loadedTime: parseInt(buffered.end(0), 10)
      })
    }
  }

  /**
   * 将秒换算成12'26"这样的格式
   * @param {Number} time e.g 20
   */
  _getTimeStr(time) {
    const timeArr = formatAudioTime(time)
    return `${timeArr[0]}'${timeArr[1]}"`
  }

  /**
   * 在音频加载后触发
   */
  _afterAudioLoad() {
    this.canPlay = true
    this._onProgress()
    this.setState({
      duration: parseInt(this.audio.duration, 10),
      currentTime: 0
    })
  }

  render() {
    const { duration, currentTime, isPlayed } = this.state

    return (
      <div className="home-page_audio">
        {/*左侧功能区*/}
        <div className="home-page_audio-left">
          {/*音频*/}
          <audio src={this.props.url}
            ref={(dom) => {
              this.audio = dom
            }}
            onLoadedMetadata={this._afterAudioLoad.bind(this)}
            onPlay={this.onPlay.bind(this)}
            onPause={this.onPause.bind(this)}
            onTimeUpdate={this._updateCurrentTime.bind(this)}
            onProgress={this._onProgress.bind(this)}></audio>
          <i className={classnames(
            "iconfont home-page_audio-playico",
            isPlayed ? "icon-1px": "icon-yuyin3")}
            onClick={this.toggleAudio.bind(this)}></i>
        </div>
        {/*右侧功能区*/}
        <div className="home-page_audio-right">
          <p className="home-page_audio-time">
            {this._getTimeStr(currentTime)} / {this._getTimeStr(duration)}
          </p>
          <ProgressBar max={this.state.duration}
            value={this.state.currentTime}
            width='100%'
            loadedValue={this.state.loadedTime}
            onDragStart={this.pause.bind(this)}
            onDragEnd={this.play.bind(this)}
            onChange={(value) => {
              this.setCurrentTime(value)
            }}></ProgressBar>
        </div>
      </div>
    )
  }
}

export default AudioPlayer