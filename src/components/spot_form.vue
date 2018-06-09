<template>
<div id="spot_form">
    <div id="googlemap-box">
        <div id="googlemap"></div>
        <div id="spot-form" :class="{ hide: !this.cur_marker}">
            <input
                id="title" type="text"
                placeholder="TITLE" v-model="cur_marker_title">
            <input
                id="graph" type="text"
                placeholder="GRAPH URL" v-model="cur_marker_url">
            <input
                id="category" type="text"
                placeholder="CATEGORY" v-model="cur_marker_sub">
            <textarea
                id="description" type="text"
                placeholder="DESCRIPTION" v-model="cur_marker_desc"
            ></textarea>
            <button @click="save_marker">Save</button>
            <button @click="remove_marker">remove</button>
        </div>
    </div>
    <ul id="toolbox">
        <li>
            <button @click="delete_markers" class="btn">CLEAR ALL SPOT</button>
        </li>
    </ul>
</div>
</template>

<script>
export default {
    name: 'spot_form',
    props: ['markers'],
    data () {
        return {
            map: null,
            cur_marker: null
        };
    },
    computed: {
        cur_marker_title: {
            get: function () {
                if ( this.cur_marker && this.cur_marker.getMap() ) {
                    return this.cur_marker.title;
                }
                return '';
            },
            set: function (newValue) {
                this.cur_marker.setTitle(newValue);
                let label = {
                    color: 'black', fontWeight: 'bold', fontSize: "18px",
                    text: newValue,
                };
                this.cur_marker.setLabel(label);
            }
        },
        cur_marker_url: {
            get: function () {
                if ( this.cur_marker && this.cur_marker.getMap() ) {
                    return this.cur_marker.graphurl;
                }
                return '';
            },
            set: function (newValue) {
                this.cur_marker.graphurl = newValue;
            }
        },
        cur_marker_desc: {
            get: function () {
                if ( this.cur_marker && this.cur_marker.getMap() ) {
                    return this.cur_marker.desc;
                }
                return '';
            },
            set: function (newValue) {
                this.cur_marker.desc = newValue;
            }
        },
        cur_marker_sub: {
            get: function () {
                if ( this.cur_marker && this.cur_marker.getMap() ) {
                    return this.cur_marker.sub;
                }
                return '';
            },
            set: function (newValue) {
                this.cur_marker.sub = newValue;
            }
        },
    },
    mounted: function () {
        this.map = new google.maps.Map( document.getElementById('googlemap'), {
            center: {lat: 25.01730588688124, lng: 121.538964443017}, zoom: 17,
            styles: [
                {
                    featureType: 'poi',
                    stylers: [{ visibility: 'off' }]
                }, {
                    featureType: 'transit.station',
                    stylers: [{ visibility: 'off' }]
                }
            ],
            disableDoubleClickZoom: true,
            mapTypeControl: false,
            
        });

        if ( this.markers.length > 0 ) {
            this.markers.forEach( (marker, index) => {
                console.log(marker);
            });
        }

        this.map.addListener('click', (e) => {
            if( !this.cur_marker ) {
                this.add_marker( { lat: e.latLng.lat(), lng: e.latLng.lng() } );
            } else {
                this.cur_marker.setAnimation(null);
                this.cur_marker = null;
            }
        });
    },
    methods: {
        add_marker: function(position) {
            let marker = new google.maps.Marker({
                position, map: this.map,
                draggable:true,
                label: {
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: "18px",
                    text: 'New Spot',
                },
                title: '', desc: '', graphurl: '', sub: ''
            });

            marker.addListener('click', (e) => {    
                if (marker.getAnimation()) {
                    marker.setAnimation(null);
                    this.cur_marker = null;
                } else {
                    if(!this.cur_marker) {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        this.cur_marker = marker;
                    }
                }
            });
            this.markers.push(marker);
        },
        set_markers_on: function(map) {
            for (let i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(map);
            }
        },
        hide_markers: function() {
            this.set_marker_on(null);
        },
        show_markers: function() {
            this.set_marker_on(this.map);
        },
        delete_markers: function() {
            this.set_markers_on(null);
            this.markers.length = 0;
        },
        remove_marker() {
            this.cur_marker.setMap(null); this.cur_marker = null;
        },
        save_marker() {
            this.cur_marker.setAnimation(null);
            this.cur_marker = null;
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

#spot_form {
    width: 100%;
}

#googlemap-box {
    position: relative;
    border: 2px solid $aradar;
    overflow: hidden;


    #googlemap {
        width: 100%;
        height: 70vh;
    }

    #spot-form {
        background: #ffffff;
        width: 25%; height: 70vh;
        position: absolute;
        top: 0; right: 0%;
        border-left: 2px solid $aradar;
        transition: right .5s;

        &.hide {
            top: 0; right: -25%;
        }

        input::placeholder, textarea::placeholder {
            color: $aradar;
            font-size: 0.875em;
        }

        input, textarea, button {
            color: $lightaradar;
            font-family: 'Lato', sans-serif;
            font-size: 1.2em;
            font-weight:900;

            width: 90%;
            padding: 15px;
            margin-top: 10px;

            background: transparent;
            outline: none;

            border: solid 1px $aradar;

            transition: all 0.3s ease-in-out;
        }

        input {
            height: 60px;
        }

        textarea {
            height: 300px;
            resize: none;
        }
    }
}

#toolbox {
    width: 100%; height: 10vh;
    margin: 1vh 0 1vh 0;
	overflow: hidden;
    display: flex;
    align-items: center;
    border: 2px solid $aradar;

    li {
        width: 100%; height: 100%;
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
    }
}

</style>
