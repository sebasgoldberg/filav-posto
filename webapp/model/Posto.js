sap.ui.define([
    'sap/ui/base/Object',
    'iamsoft/socket/model/Socket'
], function (Object, Socket) {
    'use strict';

    return {

        ESTADOS_POSTO: {
            INATIVO: 0,
            EM_PAUSA: 1,
            ESPERANDO_CLIENTE: 2,
            CLIENTE_CHAMADO: 3,
            ATENDENDO: 4,
        },

        Posto: Object.extend('iamsoft.filav.posto.model.Posto', {
            
            constructor: function () {
                this._socket = new Socket('/posto/');
                this._socket.listen( data => {
                    this.publishToEventBus(data.message, data.data);
                });
            },

            ocuparPosto: function(posto){
                this._socket.send({message: 'OCUPAR_POSTO',  data: {posto: posto, }});
            },

            chamarSeguinte: function(){
                this._socket.send({message: 'CHAMAR_SEGUINTE',  data: {}});
            },

            cancelarChamado: function(){
                this._socket.send({message: 'CANCELAR_CHAMADO',  data: {}});
            },

            finalizarAtencao: function(){
                this._socket.send({message: 'FINALIZAR_ATENCAO',  data: {}});
            },

            indicarAusencia: function(){
                this._socket.send({message: 'INDICAR_AUSENCIA',  data: {}});
            },

            atender: function(){
                this._socket.send({message: 'ATENDER',  data: {}});
            },

            desocuparPosto: function(){
                this._socket.send({message: 'DESOCUPAR_POSTO',  data: {}});
            },

            getEstado: function(){
                this._socket.send({message: 'GET_ESTADO',  data: {}});
            },

            getPostosInativos: function(local){
                this._socket.send({message: 'GET_POSTOS_INATIVOS',  data: {local: local, }});
            },

            publishToEventBus: function(event, data){
                var eventBus = sap.ui.getCore().getEventBus();
                eventBus.publish('POSTO', event, data); 
            },

        })
    };
});

