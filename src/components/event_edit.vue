<template>
<div id="event_info">
    <ul id="stepview">
        <li>
            <button @click="back">back</button>
        </li>
        <li :class="{active: step==0}" >
            <button @click="go_step(0)">event</button>
        </li>
        <li :class="{active: step==1}" >
            <button @click="go_step(1)">spot</button>
        </li>
        <li>
            <button @click="submit">submit</button>
        </li>
    </ul>
    <event-form v-show="step==0" :info="info"/>
    <spot-form  v-show="step==1" :markers="spots" />
</div>
</template>

<script>
import firebase from 'firebase/app'
import fireauth from 'firebase/auth'
import firestore from 'firebase/firestore'
import EventForm from '@/components/event_form';
import SpotForm from '@/components/spot_form';

export default {
    name: 'event_info',
    components: {
        EventForm,
        SpotForm
    },
    props: ['id'],
    data () {
        return {
            step: 0,
            db: null,
            spots: [],
            info: {
                title: '',
                category: '',
                start_time: '',
                end_time: '',
                description: ''
            },
            user: {
                email: '',
                name: ''
            }
        };
    },
    mounted () {
        let currentUser = firebase.auth().currentUser;
        this.user.email = currentUser.email;
        this.user.name  = currentUser.displayName;
        this.db = firebase.firestore();
    }, 
    methods: {
        go_step(tostep) {
            this.step = tostep;
        },
        async back() {
            const result = await confirm("Sure to back?")
            if ( result ) {
                this.$router.replace('profile');
            }
        },
        check_event_data() {
            if (!this.info.title      ) {
                alert("title not fill."); return false;       }
            if (!this.info.category   ) {
                alert("category not fill."); return false;    }
            if (!this.info.description) {
                alert("description not fill."); return false; }
            if ( !this.info.start_time || !this.info.end_time ) {
                alert("start or end time not fill."); return false;;
            } else if ( this.info.start_time >= this.info.end_time ) {
                alert("start time can't after end time."); return false;;
            } return true;
        },
        check_spot_data(spot) {
            let label_name = "[" + spot.label.text + "]";
            if (!spot.title   ) {
                alert(label_name+" title not fill."); return false;       }
            if (!spot.sub     ) {
                alert(label_name+" category not fill."); return false;    }
            if (!spot.desc    ) {
                alert(label_name+" description not fill."); return false; }
            if (!spot.graphurl) {
                alert(label_name+" graphurl not fill."); return false;    }

            return true;
        },
        check_spots_data() {
            this.spots = this.spots.filter( spot => spot.getMap() );
            if ( this.spots.length == 0 ) { alert("Please add spot."); return false; }
            return this.spots.every( spot => this.check_spot_data(spot));
        },
        async submit () {
            const result = await confirm("Sure to submit?")
            if ( result ) {
                if ( !this.check_event_data() ) { return; }
                if ( !this.check_spots_data() ) { return; }

                let colRef_event = this.db.collection("Event");
                await colRef_event.doc( this.random_docid() ).set({
                    Title: this.info.title,
                    Category: this.info.category,
                    Description: this.info.description,
                    EndTime: new Date(this.info.end_time),
                    StartTime: new Date(this.info.start_time),
                    EventHolder: [ this.user.email ]
                });

                let colRef_spot  = this.db.collection("Spot");
                await this.spots.forEach( async (spot) => {
                    let lat = spot.position.lat(), lng = spot.position.lng();
                    console.log({ Latitude: lat, Longitude: lng });
                    await colRef_spot.add({
                        Title: spot.title,
                        Position: new firebase.firestore.GeoPoint( lat, lng ),
                        Category: this.info.category,
                        SubCategory: spot.sub,
                        Description: spot.desc,
                        Graph: spot.graphurl,
                    });
                });
                this.$router.replace('profile');
            }
        },
        random_docid() {
            let text = "", possible = 
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";

            for (var i = 0; i < 4; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    }
};
</script>

<style lang="scss" scoped>
$aradar: #54b576;
$lightaradar: #6dc28b;

* {
    padding: 0; border: 0; margin: 0;
    box-sizing: border-box;
}

#event_info {
    width: 90vw;
    text-align: center;
}

#stepview {
    width: 100%; height: 5vh;
    margin: 7vh 0 1vh 0;
	overflow: hidden;
    display: flex;
    align-items: center;
    border: 2px solid $aradar;

    li {
        width: 40%; height: 100%;
        list-style-type: none;
        button {
            width: 100%; height: 100%;
            background: $aradar;
            color: white;
            font-size: 18px;
            float: left;
            position: relative;
            cursor: pointer;

            &:hover {
                background: #ffffff;
                color: $aradar;
            }
        }

        &.active button {
            background: #ffffff;
            color: $aradar;
        }

        &:last-child, &:first-child {
            width: 10%;
        }
    }
}
</style>
