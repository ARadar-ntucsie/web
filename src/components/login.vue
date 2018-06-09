<template>
<div id="login">
    <img id="brand" src="../assets/logo.png">
    <h3>Login with:</h3>
    <button v-on:click="login_google" class="login-btn login-google">
        Google
    </button>
    <button v-on:click="login_facebook" class="login-btn login-facebook">
        Coming soon ...
    </button>
    <button v-on:click="login_github" class="login-btn login-github">
        Coming soon ...
    </button>
</div>
</template>

<script>
import firebase from 'firebase/app'
import fireauth from 'firebase/auth'

export default {
    name: 'login',
    data: function() {
        return {};
    },
    mounted () {
        if ( firebase.auth().currentUser ) {
            this.$router.replace('dashboard');
        }
    }, 
    methods: {
        login_google: function() {
            let provider = new firebase.auth.GoogleAuthProvider();
            this.login( provider );
        },
        login_facebook: function() {},
        login_github: function() {},
        login: function( provider ) {
            // firebase.auth().signInWithRedirect(provider).then( (result) => {
            firebase.auth().signInWithPopup(provider).then( (result) => {
                this.$router.replace('dashboard');
            }).catch( (error) => {
                console.log(error);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
$white: #FFF;
$aradar: #54b576;
$google: #DD4B39;
$facebook: #4C69BA;
$github: #2b2b2b;

* {
    padding: 0; border: 0; margin: 0;
    box-sizing: border-box;
}
#login {
    margin: 40px auto;
    width: 30vw;
    min-width: 450px;
    text-align: center;
}

#brand {
    width: 100%;
}

.login-btn {
    background: $white;
    color: $aradar;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
    height: 50px;
    margin-top: 20px;
    border: 1px solid $aradar;  
    border-radius: 2px;
    transition: all 0.8s;

    &:hover, &:focus {
        color: $white;
    }
}
.login-google {
    border-left: 20px solid $google;
    &:hover, &:focus {
        border: 1px solid $google;  
        background: $google;
    }
}

.login-facebook {
    border-left: 20px solid $facebook;
    &:hover, &:focus {
        border: 1px solid $facebook;  
        background: $facebook;
    }
}

.login-github {
    border-left: 20px solid $github;
    &:hover, &:focus {
        border: 1px solid $github;  
        background: $github;
    }
}
</style>
