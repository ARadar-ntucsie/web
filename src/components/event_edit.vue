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
    <div class="form-box">
        <event-form class="eform" :class="{displayform : step!=0}" :info="info"/>
        <spot-form  class="sform" :class="{displayform : step!=1}" :markers="spots" />
    </div>
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
    props: ['event_id'],
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
    computed: {
        docid() {
            if ( this.event_id !== '0000' ) { return this.event_id; }

            let text = "", possible = 
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";

            for (var i = 0; i < 4; i++) {
                text += possible.charAt(Math.floor(Math.random()*possible.length));
            }

            return text;
        }
    },
    async mounted () {
        let currentUser = firebase.auth().currentUser;
        this.user.email = currentUser.email;
        this.user.name  = currentUser.displayName;
        this.db = firebase.firestore();

        if ( this.event_id !== '0000' ) {
            let docRef_event = this.db.collection("Event").doc(this.event_id);
            await docRef_event.get().then( doc => {
                if (doc.exists) {
                    let data = doc.data();
                    this.info.title       = data.Title;
                    this.info.category    = data.Category;
                    this.info.start_time  = data.StartTime.toDate().toISOString();
                    this.info.end_time    = data.EndTime.toDate().toISOString();
                    this.info.description = data.Description;
                } else { 
                    alert("No such document!");
                    this.$router.push('/event/0000');
                }
            });
        }

    }, 
    methods: {
        go_step(tostep) { this.step = tostep; },
        back() {
            const result = confirm("Sure to back?")
            if ( result ) {
                this.$router.replace('/dashboard');
            }
        },
        check_event_data() {
            let name = "[Event] ", msg = "";
                 if (!this.info.title      ) { msg = "title not fill.";       }
            else if (!this.info.category   ) { msg = "category not fill.";    }
            else if (!this.info.description) { msg = "description not fill."; }
            else if (!this.info.start_time ) { msg = "start time not fill.";  }
            else if (!this.info.end_time   ) { msg = "end time not fill.";    }
            else if ( this.info.start_time >= this.info.end_time ) {
                msg = "start time can't after end time.";
            }

            if ( msg !== "" ) { alert(name + msg); return false; }
            return true;
        },
        check_spot_data(spot) {
            let label_name = "[" + spot.label.text + "] ", msg = "";
                 if (!spot.title   ) { msg = "title not fill.";       }
            else if (!spot.sub     ) { msg = "category not fill.";    }
            else if (!spot.desc    ) { msg = "description not fill."; }
            else if (!spot.graphurl) { msg = "graphurl not fill.";    }

            if ( msg !== "" ) { alert(label_name + msg); return false; }
            return true;
        },
        check_spots_data() {
            this.spots = this.spots.filter( spot => spot.getMap() );
            if ( this.spots.length == 0 ) {
                alert("Please add spot."); return false; }

            return this.spots.every( spot => this.check_spot_data(spot) );
        },
        async submit () {
            const result = await confirm("Sure to submit?")
            if ( result ) {
                if ( !this.check_event_data() ) { return; }
                if ( !this.check_spots_data() ) { return; }

                let colRef_event = this.db.collection("Event");
                await colRef_event.doc( this.docid ).set({
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
                    await colRef_spot.add({
                        Title: spot.title,
                        Position: new firebase.firestore.GeoPoint( lat, lng ),
                        Category: this.info.category,
                        SubCategory: spot.sub,
                        Description: spot.desc,
                        Graph: spot.graphurl,
                    });
                });
                this.$router.replace('/dashboard');
            }
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

.displayform {
    display: none;
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

// /* Smartphones (portrait and landscape) ----------- */
// @media only screen 
// and (min-device-width : 320px) and (max-device-width : 480px) {
// /* Styles */
// }

// /* Smartphones (landscape) ----------- */
// @media only screen and (min-width : 321px) {
// /* Styles */
// }

// /* Smartphones (portrait) ----------- */
// @media only screen and (max-width : 320px) {
// /* Styles */
// }

// /* iPads (portrait and landscape) ----------- */
// @media only screen 
// and (min-device-width : 768px) and (max-device-width : 1024px) {
// /* Styles */
// }

// /* iPads (landscape) ----------- */
// @media only screen 
// and (min-device-width : 768px) and (max-device-width : 1024px) 
// and (orientation : landscape) {
// /* Styles */
// }

// /* iPads (portrait) ----------- */
// @media only screen 
// and (min-device-width : 768px) and (max-device-width : 1024px) 
// and (orientation : portrait) {
// /* Styles */
// }

// /* Desktops and laptops ----------- */
// @media only screen and (min-width : 1224px) {
// /* Styles */
// }

/* Large screens ----------- */
@media only screen and (min-width : 1824px) {
    .form-box {
        position: relative;
        .eform, .sform {
                position: absolute;
                display: block;
                
        }
        .eform { left: 0;  width: 30.5% !important; }
        .sform { right: 0; width: 68.5% !important; }
    }

    #stepview {
        li {
            display: none;

            &:last-child, &:first-child {
                display: inline-block;
                width: 50%;
            }
        }
    }
}

// /* iPhone 4 ----------- */
// @media
// only screen and (-webkit-min-device-pixel-ratio : 1.5),
// only screen and (min-device-pixel-ratio : 1.5) {
// /* Styles */
// }
</style>
