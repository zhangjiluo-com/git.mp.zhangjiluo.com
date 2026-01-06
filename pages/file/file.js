// file.js
Page({
  data: {
    owner: '',
    repo: '',
    path: '',
    fileName: '',
    filePath: '',
    content: '',
    contentLines: [],
    isLoading: false
  },

  onLoad: function(options) {
    this.setData({
      owner: options.owner,
      repo: options.repo,
      path: options.path,
      fileName: options.name,
      filePath: options.path
    })
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: options.name
    })
    // 加载文件内容
    this.loadFileContent()
  },

  // 加载文件内容
  loadFileContent: function() {
    const app = getApp()
    const { owner, repo, path } = this.data
    
    this.setData({
      isLoading: true
    })

    app.request(`/repos/${owner}/${repo}/contents/${path}`)
      .then(res => {
        this.setData({
          isLoading: false
        })

        if (res.encoding === 'base64') {
          // 解码base64内容
          const content = wx.base64ToArrayBuffer(res.content)
          const decodedContent = this.arrayBufferToString(content)
          this.setData({
            content: decodedContent,
            contentLines: decodedContent.split('\n')
          })
        } else {
          this.setData({
            content: res.content,
            contentLines: res.content.split('\n')
          })
        }
      })
      .catch(err => {
        this.setData({
          isLoading: false,
          content: ''
        })
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      })
  },

  // 将ArrayBuffer转换为字符串
  arrayBufferToString: function(buffer) {
    let str = ''
    const uint8Array = new Uint8Array(buffer)
    for (let i = 0; i < uint8Array.length; i++) {
      str += String.fromCharCode(uint8Array[i])
    }
    return str
  }
})