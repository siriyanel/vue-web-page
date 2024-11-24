<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">회사</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">홈</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/">제품리스트</router-link>
          </li>
          <li class="nav-item">
            <a @click="goToDetail(2);" style="cursor:pointer;"><span class="nav-link">제품상세페이지</span></a>
          </li>
          <li v-if="user.email != undefined" class="nav-item">
            <router-link class="nav-link" to="/sales">제품등록페이지</router-link>
          </li>
          <li v-if="user.email == undefined"><button class="btn btn-danger" type="button" @click="kakaoLogin">로그인</button></li>
          <li v-else><button class="btn btn-danger" type="button" @click="kakaoLogout">로그아웃</button>
          </li>
        </ul>
        <form class="d-flex" @submit.prevent="searchProducts">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="searchTerm"
          />
          <button class="btn btn-outline-success" type="submit">Search</button> 
          <!-- @click="SearchProduct(name)" -->
          <!-- name="product_name" -->
        </form>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: 'HeaderName',
  data() {
    return {
      productList: [],
      searchTerm: '' // New data property
    };
  },
  created() {
    this.getProductList(); // Function execution
  },
  computed:{
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    kakaoLogin() {
        window.Kakao.Auth.login({
            scope: 'profile_nickname, account_email', // Corrected typo: 'aacount_email' to 'account_email'
            success: this.getProfile,
            fail: (error) => {
                console.error("Login failed:", error);
            }
        });
    },
    getProfile(authObj) {
        console.log(authObj);
        window.Kakao.API.request({
            url: '/v2/user/me',
            success: res => {
                const kakao_account = res.kakao_account;
                console.log(kakao_account);
                this.login(kakao_account);
                alert("Login success");
            },
            fail: (error) => {
                console.error("Failed to get profile:", error);
            }
        });
    },
    async login(kakao_account) {
        try {
            await this.$api("/api/login", {
                param: [
                    { email: kakao_account.email, nickname: kakao_account.profile.nickname }
                ]
            });
            this.$store.commit('user', kakao_account);
        } catch (error) {
            console.error("Login API call failed:", error);
            alert("Login failed. Please try again.");
        }
    },
    kakaoLogout() {
        window.Kakao.Auth.logout((response) => {
            console.log(response);
            this.$store.commit('user', {});
            alert("Logout success");
            this.$router.push({ path: '/' });
        });
    },
    async getProductList() {
      this.productList = await this.$api("/api/productList", {}); // SQL query execution
      console.log(this.productList); // List check
    },
    goToDetail(product_id) {
      this.$router.push({ path: '/detail', query: { product_id: product_id } });
    },
    searchProducts() {
      // Navigate to ProductSearch component with the search term
      this.$router.push({ path: '/search', query: { term: this.searchTerm } });
    }
    }
  }
</script>
