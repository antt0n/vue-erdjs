<script setup lang="ts">
import { reactive, computed, onMounted, inject } from "vue"
import PingPongSC from '../pingpong/PingPongSC'
import { Balance } from "@elrondnetwork/erdjs"

const $erd = inject("$erd");
const $erdProxy = inject("$erdProxy");

var data = reactive({
    qrcode: null,
    deepLink: null,
    goRight: false,
    goLeft: false,
    error: null,
    pingPong: null,
    pingAmount: 0,
    hasPing: false,
    $erd: $erd,
    $erdProxy: $erdProxy
})

async function ping() {
    this.goLeft = false;
    this.goRight = true;
    this.pingPong.dateToPong(this.$erd.walletAddress);

    try {
        await this.pingPong.ping(this.$erd.walletAddress, this.pingAmount);
    } catch (error) {
        this.goRight = false;
    }
}
function pong() {
    this.goRight = false;
    this.goLeft = true;
}

/* Change for INJECT
this.$erd.$on('transaction', (transaction) => {
    console.log("transaction", transaction);
    const trans = transaction[0];
    if (!trans.status.isSuccessful()) {
        this.error = `Transaction failed : ${trans.getSmartContractResults().getImmediate().getReturnMessage()}`;
    }
})*/

const pingEgldPrice = computed(() => {
    if(data.pingAmount) {
        let amount = Balance.egld(data.pingAmount.valueOf());
        let denominated = amount.valueOf().shiftedBy(-amount.token.decimals).toFixed(2);
        return `${denominated} ${amount.token.getTokenIdentifier()}`;
    }
    return '- EGLD';
})

onMounted(() => {
    data.pingPong = new PingPongSC($erd.providers);
    data.pingPong.pingAmount().then((amount) => {
        data.pingAmount = amount;
    });
    data.pingPong.didUserPing($erd.walletAddress).then((hasPing) => {
        data.hasPing = hasPing;
    })
})

</script>
<template>
  <div>
    <h1>Ping pong smartcontract ({{ pingEgldPrice }})</h1>
      <div class="pingpong__error">{{data.error ? data.error : ' '}}</div>
      <div class="pingpong">
          <div class="pingpong__left" :class="{ 'pingpong__left--animated': data.goLeft || data.goRight}"/>
          <button :class="{ 'pingpong__ball--goright': data.goRight, 'pingpong__ball--goleft': data.goLeft}" class="pingpong__ball" @click.prevent="ping()">
              {{data.goRight ? 'Pong!' : 'Ping!'}}
          </button>
          <div class="pingpong__right" :class="{ 'pingpong__right--animated': data.goLeft || data.goRight}"/>
          <div class="pingpong__clear"></div>
      </div>
  </div>
</template>