<template>
<div id="event-form">
    <form action="">
        <input v-model="info.title" type="text" placeholder="TITLE">
        <input v-model="info.category" type="text" placeholder="CATEGORY">
        <div class="datetime">
            <label>START TIME</label>
            <datetime
                use12-hour
                class="datetimepicker"
                type="datetime"
                :minute-step="30"
                :format="{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }"
                v-model="info.start_time"
            ></datetime>
        </div>
        <div class="datetime">
            <label>END TIME</label>
            <datetime
                use12-hour
                class="datetimepicker"
                type="datetime"
                :minute-step="30"
                :format="{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short'
                }"
                v-model="info.end_time"
            ></datetime>
        </div>
        <textarea
            v-model="info.description" type="text" placeholder="DESCRIPTION"
        ></textarea>
    </form>
</div>
</template>

<script>
import { Datetime } from 'vue-datetime';
import '../vue-datetime.css';

export default {
    name: 'event-form',
    components: {
        datetime: Datetime
    },
    props: ['info'],
    data () {
        return { };
    },
    mounted () { }, 
    methods: { }
};
</script>

<style lang="scss" scoped>
$aradar: #54b576;

* {
    padding: 0; border: 0; margin: 0;
    box-sizing: border-box;
}

#event-form {
    width: 100%;
}

form {
    width: 100%;
}

input::placeholder, textarea::placeholder {
    color: $aradar;
    font-size: 0.875em;
}
input:hover::placeholder, textarea:hover::placeholder {
    font-size: 0.875em;
}

input, textarea, .datetime {
    color: $aradar;
    font-family: 'Lato', sans-serif;
    font-size: 1.2em;

    width: 100%;
    padding: 15px;

    background: transparent;
    outline: none;

    border: solid 1px $aradar;
    border-bottom: none;
    border-radius: 0; 

    transition: all 0.3s ease-in-out;
}

input {
    height: 60px;
}

textarea {
    border: solid 1px $aradar;
    height: 60vh;
    resize: none;
}

input:hover, textarea:hover {
    border: solid 4px $aradar;
}

.datetime {
    display: flex;
    padding: 0px;

    label {
        float: left;
        width: 150px;
        line-height: 60px;
        text-align: left;
        padding: 0 15px;
        border-right:  solid 1px $aradar;
    }
    .datetimepicker {
        flex: 1;
        display: inline-block;
        height: 60px;
    }
}

</style>
