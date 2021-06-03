<style  lang="less" scoped>
* {
  margin: 0;
}
[v-cloak] {
  display: none;
}
table {
  border: 1px solid #e9e9e9;
  border-collapse: collapse;
  border-spacing: 0;
  // 隐藏表格中空单元格上的边框和背景：
  empty-cells: show;
}
th,
td {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}
th {
  background: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
  white-space: nowrap;
}
.menu {
  border: 1px solid #ccc;
}
.btn-group {
  position: fixed;
  top: 0;
  z-index: 9999;
  background: #fafbfc;
  width: 100%;
}
.container-water-fall {
  // padding: 0 28px;
  width: 100vw;
  box-sizing: border-box;
  h4 {
    padding-top: 56px;
    padding-bottom: 28px;
    font-family: PingFangSC-Medium;
    font-size: 36px;
    color: #000000;
    letter-spacing: 1px;
    text-align: justify;
  }
  button {
    background-color: #ff0;
    color: #24292e;
    border: 1px solid rgba(27, 31, 35, 0.2);
    border-radius: 0.25em;
    width: 100px;
    line-height: 26px;
    font-size: 13px;
    margin: 4px 0;
    margin-right: 4px;
    cursor: pointer;
    outline: none;
    &.blue-light {
      background: #27fbc2;
    }
  }
  button:hover {
    background-image: linear-gradient(-180deg, #fafbfc, #ccc 90%);
  }

  .cell-item {
    width: 100%;
    // margin-bottom: 18px;
    background: #ffffff;
    border: 2px solid #f0f0f0;
    border-radius: 12px 12px 12px 12px;
    overflow: hidden;
    box-sizing: border-box;
    img {
      // border-radius: 12px 12px 0 0;
      width: 100%;
      height: auto;
      display: block;
    }
    .item-body {
      // border: 1px solid #F0F0F0;
      padding: 12px;
      .item-desc {
        font-size: 15px;
        color: #333333;
        line-height: 15px;
        font-weight: bold;
      }
      .item-footer {
        margin-top: 22px;
        position: relative;
        display: flex;
        align-items: center;

        .name {
          max-width: 150px;
          margin-left: 10px;
          font-size: 14px;
          color: #999999;
        }
        .like {
          position: absolute;
          right: 0;
          display: flex;
          align-items: center;
          &.active {
            .like-total {
              color: #ff4479;
            }
          }
          i {
            width: 28px;
            display: block;
          }
          .like-total {
            margin-left: 10px;
            font-size: 12px;
            color: #999999;
          }
        }
      }
    }
  }
}

.headerwrapper {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
}
.header {
  height: 80px;
  line-height: 80px;
  z-index: 100;
  position: relative;
}

.headerwrapper .container {
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdfe6;
  width: 1140px;
}

.header h1 {
  margin-left: 50px;
  float: left;
  font-size: 32px;
  font-weight: 400;
}
.nav {
  background: transparent;
  margin: 0;
  float: right;
}
</style>
<template>
  <div class="container-water-fall">
    <!-- <h1 style="position: fixed;left: 0;top: 100px;font-style: 15px;color:blue;z-index: 1000;">{{loadstatus}}</h1> -->
    <div class="headerwrapper">
      <header class="header">
        <div class="container">
          <h1>Pixiviewer</h1>
          <ul class="nav">
            <li class="navitem search">
              <div class="input">
                <input />
              </div>
            </li>
          </ul>
        </div>
      </header>
      <!--<input class="box" :placeholder="placeholder" v-model="query" />
            <div class="menu">
                <div class="main" v-clickoutside="handleClose">
                    <button @click="show = !show">点击显示下拉菜单</button>
                    <div class="dropdown" v-show="show">
                        <p>下拉框的内容,点击外面区域可以关闭</p>
                    </div>
                </div>
            </div-->
    </div>
    <div><button @click="loadmore">loadmore</button> <button @click="switchCol('5')">5列</button> <button @click="switchCol('8')">8列</button> <button @click="switchCol('10')">10列</button> </div>
    ><waterfall
      :col="5"
      :data="data"
      @loadmore="loadmore"
      :lazyDistance="50"
      :loadDistance="50"
    >
      <template>
        <!--viewer :images="data"-->
        <div
          class="cell-item"
          v-for="(item,index) in data"
          :key="index"
          v-viewer="{navbar: 0, toolbar: {zoomIn: 1,zoomOut: 1,oneToOne: 1,reset: 1,prev: 0,play: {show: 1,size: 'large'},next: 0,rotateLeft: 1,rotateRight: 1,flipHorizontal: 1,flipVertical: 1}}"
        >
          <img
            v-if="item.path"
            :lazy-src="'./static/'+item.path"
            :alt="item.illustTitle"
          />
          <div class="item-body">
            <div class="item-desc">{{item.illustTitle}}</div>
            <div class="item-footer">
              <div class="name">{{item.userName}}</div>
              <div
                class="like"
                :class="item.liked?'active':''"
              >
                <div class="like-total">{{item.path}}</div>
              </div>
            </div>
          </div>
        </div>
        <!--/viewer-->
      </template>
    </waterfall>
  </div>
</template>

<script>
function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export default {
  props: {
    title: String,
    placeholder: {
      type: String,
      default: '搜索tag'
    }
  },
  data () {
    return {
      query: '',
      show: false,
      data: [],
      start: 0,
      col: 5,
      loading: false,
      shuffled: [],
      next: 0
    }
  },
  handleClose () {
    this.show = false
  },
  directives: {
    clickoutside: {
      bind: function (el, binding, vnode) {
        function documentHandler (e) {
          if (el.contains(e.target)) {
            return false
          }
          if (binding.expression) {
            binding.value(e)
          }
        }
        el._vueClickOutside_ = documentHandler
        document.addEventListener('click', documentHandler)
      },
      unbind: function (el, binding) {
        document.removeEventListener('click', el._vueClickOutside_)
        delete el._vueClickOutside_
      }
    }
  },
  created () {
    this.$watch(
      'query',
      debounce(newQuery => {
        console.log(newQuery)
      }, 200)
    )
  },
  computed: {
    itemWidth () {
      return 133 * 0.5 * (document.documentElement.clientWidth / 375)
    },
    gutterWidth () {
      return 10 * 0.5 * (document.documentElement.clientWidth / 375)
    }
  },
  methods: {

    switchCol (col) {
      this.col = col
      // console.log(this.col)
    },

    randint (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },

    shuffle () {
      let ans = []
      fetch('http://127.0.0.1:9876?action=getnum')
        .then(function (res) {
          return res.text()
        })
        .then(data => {
          let count = JSON.parse(data)[0]['COUNT(*)']
          for (let i = 0; i < count; i++) {
            ans.push(i)
          }
          for (let i = 0; i < count; i++) {
            let tmp = ans[i]
            let k = this.randint(i, count - 1)
            ans[i] = ans[k]
            ans[k] = tmp
          }
          this.shuffled = ans
          this.loadmore()
        })
        .catch(err => console.log(err))
    },

    loadmore () {
      let reqlist = []
      for (let i = this.start; i < this.start + 25; i++) {
        reqlist.push(this.shuffled[i])
      }
      fetch('http://127.0.0.1:9876', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: reqlist
        })
      })
        .then((res) => res.text())
        .then(data => {
          this.data = this.data.concat(JSON.parse(data))
          this.start = this.start + 25
        })
        .catch(err => {
          console.log(err)
        })
    }

    /* loadmore () {
      console.log('loadmore')
      fetch(
        'http://10.17.113.217:9876?action=get' +
        '&start=' +
        this.start +
        '&num=25',
        {
          method: 'GET',
          mode: 'cors'
        }
      )
        .then(function (res) {
          return res.text()
        })
        .then(data => {
          this.data = this.data.concat(JSON.parse(data))
          console.log(this.data)
          this.start = this.start + 25
          console.log(this.start)
        })
        .catch(err => {
          console.log(err)
        })
    } */
  },
  mounted () {
    this.shuffle()
  }
}
</script>
