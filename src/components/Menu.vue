<template>
  <div :class="['ui top fixed inverted massive menu', postTypeClass]">
    <router-link active-class="active" class="item" :to="homeRoute"><i class="home icon"></i> Home</router-link>
    <router-link active-class="active" class="item" :to="followRoute"><i class="users icon"></i> {{ followText }}</router-link>
    <router-link active-class="active" class="item" to="/profile"><i class="user icon"></i> Profile</router-link>
    <div class="right menu">
      <div class="item">
        <img :src="userIcon" class="ui avatar image" alt="User Icon" />
      </div>
      <a @click="logout" class="item"><i class="sign out icon"></i> Logout</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  props: {
    postType: Number,
    userIcon: {
      type: String,
      default: 'https://www.w3schools.com/howto/img_avatar.png'
    }
  },
  computed: {
    accountType() {
      return window.localStorage.getItem('account_type');
    },
    homeRoute() {
      const route = this.accountType === 'doctor' ? '/home-doctor' : '/home-patient';
      return route;
    },
    followRoute() {
      const route = this.accountType === 'doctor' ? '/patient-list' : '/doctor-list';
      return route;
    },
    followText() {
      return this.accountType === 'doctor' ? 'Followers' : 'Following';
    },
    postTypeClass() {
      switch (this.postType) {
        case 1:
          return 'daily-record-theme';
        case 2:
          return 'meal-record-theme';
        case 3:
          return 'medicine-theme';
        default:
          return '';
      }
    }
  },
  methods: {
    logout() {
      window.localStorage.clear();
      this.$router.replace({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
.daily-record-theme {
  background-color: #00b5ad !important;
}

.meal-record-theme {
  background-color: #f2711c !important;
}

.medicine-theme {
  background-color: #21ba45 !important;
}

.ui.top.fixed.inverted.massive.menu .item {
  color: white !important;
}

.ui.top.fixed.inverted.massive.menu .item.active {
  border-bottom: 2px solid white;
  color: white !important;
}

.ui.top.fixed.inverted.massive.menu .item i.icon {
  color: white !important;
}
</style>