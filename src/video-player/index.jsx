/**
 * 视频播放器
 */
import React, { Component } from 'react'
import ProgressBar from '../progress-bar'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { formatAudioTime } from 'utils/time'

import './index.less'

class VideoPlayer extends Component {
  state = {
    isPlayed: false,  // 播放状态
    duration: 0,  // 视频总时长
    currentTime: 0,  //当前播放的time
    loadedTime: 0  // 缓存的time
  }

  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),  // 视频宽度
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),  // 视频高度
    url: PropTypes.string,  // 视频地址
    className: PropTypes.string
  }

  static defaultProps = {
    width: '100%',
    height: '100%'
  }


  /**
   * 格式化时间
   * @param {Number} seconds 时间(s)
   */
  formatTime(seconds) {
    const time = formatAudioTime(parseInt(seconds, 10))

    return `${time[0]}:${time[1]}`
  }

  toggleVideoPlay() {
    if (this.state.isPlayed) {
      this.pause()
    } else {
      this.play()
    }
  }

  play() {
    this.video.play()
  }

  pause() {
    this.video.pause()
  }

  setVideoCurrentTime(nCurrentTime) {
    this.video.currentTime = nCurrentTime
  }

  /**
   * 设置全屏
   */
  setFullscreen() {
    const v = this.video
    if (v.webkitRequestFullscreen) {
      v.webkitRequestFullscreen()
    } else if (v.mozRequestFullScreen) {
      v.mozRequestFullScreen()
    } else if (v.msRequestFullscreen) {
      v.msRequestFullscreen()
    } else if (v.oRequestFullscreen) {
      v.oRequestFullscreen()
    } else if (v.requestFullscreen) {
      v.requestFullscreen()
    } else {
      console.error("该浏览器不支持全屏播放视频")
    }

  }

  _onPlay() {
    this.setState({
      isPlayed: true
    })
  }

  _updateCurrentTime() {
    const currentTime = this.video.currentTime
    this.setState({
      currentTime
    })
  }

  _onPause() {
    this.setState({
      isPlayed: false
    })
  }

  /**
   * 刷新加载进度
   */
  _onProgress() {
    const buffered = this.video.buffered
    if (buffered.length > 0) {
      this.setState({
        loadedTime: parseInt(buffered.end(0), 10)
      })
    }
  }

  _onVideoLoaded() {
    const duration = this.video.duration

    this.setState({
      duration: parseInt(duration, 10),
      currentTime: 0
    })

    this._onProgress()
  }

  render() {
    const { width, height, url, className } = this.props
    const { duration, currentTime, loadedTime } = this.state
    return (
      <div className={classnames("mpc-video", className)}
        style={{
          width: typeof width === 'number' ? (width + 'px') : width,
          height: typeof height === 'number' ? (height + 'px') : height
        }}>
        <video src={url}
          className="mpc-video_video"
          onLoadedMetadata={this._onVideoLoaded.bind(this)}
          onPlay={this._onPlay.bind(this)}
          onPause={this._onPause.bind(this)}
          onTimeUpdate={this._updateCurrentTime.bind(this)}
          onProgress={this._onProgress.bind(this)}
          ref={(dom) => {
            this.video = dom
          }}
          onClick={this.toggleVideoPlay.bind(this)}></video>

        {/*工具栏*/}
        <div className="mpc-video_tool">
          <div className="mpc-video_tool-progress">
            <span className="mpc-video_tool-time">{this.formatTime(currentTime)}</span>
            <ProgressBar width={240}
              className="mpc-video_progress-bar"
              playBarColor="rgb(203, 45, 26)"
              pointStyle={{
                borderColor: 'rgb(203, 45, 26)',
                background: 'rgb(203, 45, 26)'
              }}
              loadBarColor="rgba(222, 222, 222, 0.4)"
              value={currentTime}
              max={duration}
              defaultBarColor="rgba(66,74,74, 0.5)"
              loadedValue={loadedTime}
              onChange={this.setVideoCurrentTime.bind(this)}
              onDragStart={this.pause.bind(this)}
              onDragEnd={this.play.bind(this)}></ProgressBar>
            <span className="mpc-video_tool-time">{this.formatTime(duration)}</span>
          </div>
          {/*全屏按钮*/}
          <i className="mpc-video_fullscreen-ico iconfont icon-quanping"
            onClick={this.setFullscreen.bind(this)}></i>
        </div>
      </div>
    )
  }
}

export default VideoPlayer