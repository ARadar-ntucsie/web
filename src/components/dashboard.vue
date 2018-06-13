<template>
<div id="dashboard">
    <img id="brand" src="../assets/logo.png">
    <div id="dashboard-box">
        <profile id="profile" :user="user"/>
        <button @click="add_event('0000')" class="btn">Add event</button>
        <button @click="logout" class="btn">Logout</button>
        <div id="event-box">
            <div class="no-result" v-show="!events.length">
                <h2>No Event!!</h2>
            </div>
            <button
                class="event_card" @click="add_event(event.id)"
                v-for="(event, index) in events" :key="index"
                disabled
            >
                <button @click.stop="remove_event(event.id)" >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <path :d="svg.trash"/>
                    </svg>
                </button>
                <h3 class="title"> {{ event.title }}</h3>
                <h5 class="title"> {{ event.id }}</h5>
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
            },
            svg: {
                trash: "M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z"
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
        logout () {
            firebase.auth().signOut().then( () => {
                this.$router.replace('/login');
            });
        },
        add_event ( id ) {
            this.$router.push(`/event/${id}`);
        },
        async remove_event( id ) {
            const result = await confirm(`Are you sure to delete event: ${id} ?`);
            if ( result ) {
                this.events = this.events.filter( e => e.id !== id );
                console.log("remove", id);
            }

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
    background: $aradar;
    border-radius: 5px;
    display: inline-block;
    width: 23%; height: 20%;
    margin: 1%;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    cursor: pointer;

    &:hover {
        box-shadow: 0 5px 5px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
    }

    h3, h5{
        width: 100%;
        padding: 10px;
        text-align: center;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }

    h5 {
        color: #1e5f35;
    }

    button {
        position: absolute;
        background: transparent;
        top: 0; right: 0;
        cursor: pointer;

        &:hover {
        }
        svg {
            margin: 5px;
            top: 0; right: 0;
            width: 1em; height: 1em;
        }
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
