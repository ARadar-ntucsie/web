<template>
<div>
    <div class="profile">
        <div class="photo">
            <img :src="this.user.graph" />
        </div>
        <div class="content" >
            <div class="text">
                <h3>{{ this.user.name }}</h3>
                <h5>{{ this.user.email }}</h5>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'profile',
    props: ['user'],
    data () {
        return { };
    },
    mounted () { }, 
    methods: { }
};
</script>

<style lang="scss" scoped>
$white: #FFF;
$aradar: #54b576;

* {
    padding: 0; border: 0; margin: 0;
    box-sizing: border-box;
}

.profile {
    width: 90%;
	height: 80px;
    position: absolute;
    top: 50%; left: 50%;
    border: 2px solid $aradar;
    transform: translate(-50%, -50%);
    background-color: #fafafa;
    animation: show-profile .5s forwards ease-in-out;

    @keyframes show-profile {
        0% { width: 0; }
    }

    .photo {
        width: 110px;
        height: 110px;
        border-radius: 50%;
		overflow: hidden;
		border: 5px solid #fafafa;
		background-color: #fafafa;
		margin-top: -25px;
		margin-left: -55px;
		box-shadow: 0 0 .5rem #babbbc;
		animation: rotate-photo .5s forwards ease-in-out;
		@keyframes rotate-photo {
			100% { transform: rotate(-360deg); }
        }
		img { width: 100%; }
    }

    .content {
        width: 100%; height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0; left: 0;

		&:before {
			content: '';
            width: 10%; height: 150%;
			position: absolute;
			background-color: $aradar;
			left: 0; top: -20px;
			z-index: -1;
			transform: rotate(-8deg);
        }
		.text {
			margin: 20px auto;
			h3, h5 {
				font-weight: normal;
				margin: 3px 0;
				letter-spacing: .5px;
				white-space: nowrap;
            }
        }
    }
}
</style>
