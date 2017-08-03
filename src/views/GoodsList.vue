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
          <a href="javascript:void(0)" @click="sortGoods()" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop()">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="priceChecked = 'all'" :class="{cur: priceChecked == 'all'}" >All</a></dd>
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
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">加载中 ...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import NavHeader from '@/components/NavHeader';
  import NavFooter from '@/components/NavFooter';
  import NavBread from '@/components/NavBread';
  import axios from 'axios';

  export default{
    data (){
      return {
        goodsList: [],
        sortFlag: true,
        page: 1,
        pageSize: 8,
        busy: true,
        priceChecked: 'all',
        priceFilter: [{
          startPrice: '0.00',
          endPrice: '500.00',
        },{
          startPrice: '500.00',
          endPrice: '1000.00',
        },{
          startPrice: '1000.00',
          endPrice: '2000.00',
        }],
        filterBy: false,
        overLayFlag: false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread
    },
    mounted () {
      this.getGoodsList();
    },
    methods: {
      getGoodsList (flag) {
        const params = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1
        };
        axios.get('/goods', {
          params,
        }).then(result => {
          const { list, count } = result.data.result
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
        this.closePop();
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
      }
    }
  }
</script>
