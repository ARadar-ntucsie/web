
<template>
<div id="dashboard">
    <img id="brand" src="../assets/logo.png">
    <div id="dashboard-box">
        <profile id="profile" :user="user"/>
        <button v-on:click="add_event('0000')" class="btn">Add event</button>
        <button v-on:click="logout" class="btn">Logout</button>
        <div id="event-box">
            <div class="no-result" v-show="!events.length">
                <h2>No Event!!</h2>
            </div>
            <button
                class="event_card" v-on:click="add_event(event.id)"
                v-for="(event, index) in events" :key="index"
                disabled
            >
                <h4 class="title"> {{ event.title }}</h4>
                <h4 class="title"> {{ event.id }}</h4>
            </button>
        </div>
    </div>
</div>
</template>
<script>
import Profile from '@/components/profile';
import firebase from 'firebase/app';
import fireauth from 'firebase/auth';
import firestore from 'firebase/firestore';

export default {
    name: 'dashboard',
    components: {
        Profile,
    },
    data () {
        return {
            events: [],
            user: {
                email: '',
                name: '',
                graph: ''
            }
        };
    },
    mounted () {
        let currentUser = firebase.auth().currentUser;
        this.user.email = currentUser.email;
        this.user.name  = currentUser.displayName;
        this.user.graph = currentUser.photoURL;

        firebase.firestore().collection("Event").get().then( query => {
            query.forEach( doc => {
                let data = doc.data();
                if (data.EventHolder.some( holder => (holder === this.user.email) ) ) {
                    this.events.push({
                        id: doc.id,
                        title: data.Title
                    });
                }
            });
        });
    }, 
    methods: {
        logout: function() {
            firebase.auth().signOut().then( () => {
                this.$router.replace('/login');
            });
        },
        add_event: function( id ) {
            this.$router.push('/event/'+id);
        }
    }
};
</script>

<style lang="scss" scoped>
$white: #FFF;
$aradar: #54b576;
* {
    padding: 0; border: 0; margin: 0;
    box-sizing: border-box;
}

#dashboard {
    margin: 40px auto;
    width: 100vw;
    min-width: 450px;
    text-align: center;

    #brand { width: 30vw; }

    #dashboard-box {
        width: 80vw; 
        margin: auto;

        #profile {
            height: 100px;
            margin-bottom: 10px;
            position: relative;

        }

        #event-box {
            margin: 1.4em auto;
            width: 90%; height: 50vh;
            border: 2px solid $aradar;
            text-align: left;
        }
    }
}

.btn {
    background: $white;
    color: $aradar;
    font-size: 18px;
    cursor: pointer;
    width: 45%; height: 50px;
    border: 2px solid $aradar;
    border-left: 20px solid $aradar;
    border-radius: 2px;
    transition: all 0.8s;

    &:hover {
        border: 1px solid $aradar;  
        background: $aradar;
        color: $white;
    }
}

.event_card {
    background: #54b576;
    border-radius: 5px;
    display: inline-block;
    width: 23%; height: 20%;
    margin: 1%;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    &:hover {
        box-shadow: 0 5px 5px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
    }

    h4 {
        width: 100%;
        padding: 10px;
        text-align: center;
    }
}

.no-result {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    h2 { color: $aradar; }
}


</style>
