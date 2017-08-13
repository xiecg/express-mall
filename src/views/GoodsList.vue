<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" @click="sortGoods()" class="price" :class="{'sort-up': !sortFlag}">Price 
            <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"><svg id="icon-arrow-short" viewBox="0 0 25 32" width="100%" height="100%"><title>arrow-short</title> <path d="M24.487 18.922l-1.948-1.948-8.904 8.904v-25.878h-2.783v25.878l-8.904-8.904-1.948 1.948 12.243 12.243z" class="path1"></path></svg></use></svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop()">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{cur: priceChecked == 'all'}" >All</a></dd>
              <dd v-for="(price, index) in priceFilter" >
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{cur: priceChecked == index}">{{ price.startPrice }} - {{ price.endPrice }}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="`/static/${item.productImage}`" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{ item.productName }}</div>
                    <div class="price">{{ item.salePrice }}</div>
                    <div class="btn-area">
                      <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" class="load-more">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal :mdShow="mdShow" @close="closeModal">
      <div slot="message">登录才能加入购物车哦~</div>
      <div slot="btnGroup">
        <a href="javascript:void(0);" @click="mdShow=false" class="btn btn--m">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModalCart">
      <div slot="message">
        <p><svg class="icon-status-ok"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use></svg> <span>加入购物车成!</span></p>
      </div>
      <div slot="btnGroup">
        <div><a href="javascript:;" @click="mdShowCart=false" class="btn btn--m">继续购物</a> <a href="/#/cart" class="btn btn--m btn--red">查看购物车</a></div>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import NavHeader from '@/components/NavHeader';
  import NavFooter from '@/components/NavFooter';
  import NavBread from '@/components/NavBread';
  import Modal from '@/components/Modal';
  import axios from 'axios';

  export default{
    data (){
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        loading: false,
        mdShow: false,
        mdShowCart: false,
        priceChecked: 'all',
        priceFilter: [{
          startPrice: '0.00',
          endPrice: '100.00',
        },{
          startPrice: '100.00',
          endPrice: '500.00',
        },{
          startPrice: '500.00',
          endPrice: '1000.00',
        },{
          startPrice: '1000.00',
          endPrice: '5000.00',
        }],
        filterBy: false,
        overLayFlag: false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    mounted () {
      this.getGoodsList();
    },
    methods: {
      getGoodsList (flag) {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked
        };
        this.loading = true;
        axios.get('/goods/list', {
          params,
        }).then(result => {
          const { list, count } = result.data.result
          this.loading = false;
          if (flag) {
            this.goodsList = this.goodsList.concat(list);
            this.busy = count ? false : true;
          } else {
            this.goodsList = list;
            this.busy = false;
          }
        });
      },
      sortGoods () {
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      setPriceFilter (index) {
        this.priceChecked = index;
        this.page = 1;
        this.closePop();
        this.getGoodsList();
      },
      showFilterPop () {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      closePop () {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      loadMore () {
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
          this.busy = true;
        }, 500);
      },
      addCart (productId) {
        axios.post('/goods/addCart', {
          productId,
        }).then(result => {
          result = result.data;
          if (result.status) {
            // alert(`加入失败 msg: ${ result.msg }`);
            this.mdShow = true;
          } else {
            this.mdShowCart = true;
          }
        });
      },
      closeModal () {
        this.mdShow = false;
      },
      closeModalCart () {
        this.mdShowCart = false;
      }
    }
  }
</script>
