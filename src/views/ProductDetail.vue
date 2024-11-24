<template>
<main class="mt-3">
  <div class="container">
    <div class="row">
      <div class="col-md-5">
        <div id="carouselExampleIndicators" class="carousel carousel-dark slide" data-bs-ride="carousel">
          <ol class="carousel-indicators">
            <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></li>
            <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
            <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>  
          </ol>  
            <div class="carousel-inner">
              <div :class="`carousel-item ${i==0?'active':''}`" :key="i" v-for="(pimg, i) in productImage">
                <img :src="`/download/${productId}/${pimg.path}`" class="d-block w-100" alt="...">               
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </a>
        </div>
      </div>
      <div class="col-md-7">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title  d-flex justify-content-center">{{productDetail.product_name}}</h5>
            <h5 class="card-title pt-3 border-top  d-flex justify-content-center">{{getCurrencyFormat(productDetail.product_price)}}원</h5>
              <p class="card-text border-top pt-3 d-flex justify-content-center">
                <span class="badge bg-dark me-1">{{productDetail.category1}}</span>
                <span class="badge bg-dark me-1">{{productDetail.category2}}</span>
                <span class="badge bg-dark">{{productDetail.category3}}</span>  
              </p>
              <p class="card-text pb-3 d-flex justify-content-center">
                배송비 {{getCurrencyFormat(productDetail.delivery_price)}}원 | 도서산간(제주도) 배송비 추가 {{getCurrencyFormat(productDetail.add_delivery_price)}}원 | 택배배송 | {{productDetail.outbound_days}}일 이내 출고(주말, 공휴일 제외)
              </p>
              <div class="card-text border-top pb-3">
                <div class="row">
                  <div class="col-auto mt-2">
                    <label class="col-form-label"><h5>구매수량</h5></label>  
                  </div>
                  <div class="col-auto mt-3">
                    <div class="input-group">
                      <span class="input-group-text" style="cursor:pointer;" @click="calculatePrice(-1);">-</span>
                      <input type="text" class="form-control" style="width:40px;" v-model="total">
                      <span class="input-group-text" style="cursor:pointer;" @click="calculatePrice(1);">+</span>  
                    </div>
                  </div>  
                </div>  
              </div>
              <div class="row pt-3 pb-3 border-top">
                <div class="col-6">
                <h3>총 상품 금액</h3> 
                </div>
                <div class="col-6" style="text-align: right;">
                  <h3>{{getCurrencyFormat(totalPrice)}}원</h3>
                </div>   
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="col-6 d-grid p-1">
                  <button type="button" class="btn btn-lg btn-dark" @click="addToCart">장바구니 담기</button>
                </div>
                <div class="col-6 d-grid p-1">
                  <button type="button" class="btn btn-lg btn-danger">주문하기</button>
                </div>
              </div>                
          </div>  
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <img :src="`/download/${productId}/${productDetail.path}`" class="img-fluid" />
      </div>
    </div>
  </div>
</main>
</template>
<script>
export default {
  data() {
    return {
      productId: 0,
      productDetail: {},
      productImage: [],
      total: 1,
      totalPrice: 0
    };
  },
  created() {
    this.productId = this.$route.query.product_id;
    this.getProductDetail();
    this.getProductImage();
  },
  methods: {
    calculatePrice(cnt) {
      let total = this.total + cnt;
      if(total < 1) total = 1;
      this.total = total;
      this.totalPrice = this.productDetail.product_price * this.total;
    },
    getCurrencyFormat(value) {
      return this.$currencyFormat(value);
    },
    async getProductDetail() {
      let productDetail = await this.$api("/api/productDetail",{param:[this.productId]});
      if(productDetail.length > 0) {
        this.productDetail = productDetail[0];
        this.totalPrice = this.totalPrice = this.productDetail.product_price * this.total;
      }
      console.log(this.productDetail);
    },
    async getProductImage() {
      this.productImage = await this.$api("/api/productMainImages",{param:[this.productId]});
      console.log('this.productImage',this.productImage)
    },
    async addToCart(productId) {
    const userId = this.$store.state.user.id; 
    if (!userId) {
        console.error('User ID is undefined. User may not be logged in.');
        return;
    }
    
    const quantity = 1; 

    try {
        const response = await this.$api('/addToCart', { user_id: userId, product_id: productId, quantity });
        
        // API 응답 형식 확인
        console.log('Add to cart response:', response);
        
        // 응답에서 data 속성 확인
        if (response && response.data) {
            console.log('Data:', response.data);
            this.$swal.fire('Success!', 'Item added to cart!', 'success');
        } else {
            console.error('Unexpected response format:', response);
            this.$swal.fire('Error!', 'Failed to add item to cart.', 'error');
        }
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        this.$swal.fire('Error!', 'Failed to add item to cart.', 'error');
    }
}

  }
}
</script>