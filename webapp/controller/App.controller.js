sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'iamsoft/filav/posto/model/Posto',
    'iamsoft/filav/posto/model/formatter',
], function(Controller, JSONModel, Posto, formatter) {
    'use strict';

    let ESTADOS = {
        semPosto: false,
        localSelecionado: false,
        postoSelecionado: false,
        emPausa: false,
        esperandoCliente: false,
        clienteChamado: false,
        atendendo: false,
    };

    let ESTADOS_POSTO = Posto.ESTADOS_POSTO;

    let MODELS = {
        locais: [],
        posto: {},
        postos: [],
        form: {local:'', posto:''},
        view: {
            estado: ESTADOS,
        },
        notificacoes: [],
    };


    return Controller.extend('iamsoft.filav.posto.controller.App', {

        formatter: formatter,

        onInit: function () {

            var eventBus = sap.ui.getCore().getEventBus();
            eventBus.subscribe('POSTO', 'LOCAIS_DISPONIVEIS',
                this.onLocaisDisponiveis, this);
            eventBus.subscribe('POSTO', 'POSTO', this.onPosto, this);
            eventBus.subscribe('POSTO', 'POSTOS_INATIVOS',
                this.onPostosInativos, this);

            let models = Object.assign({},MODELS);
            for (let model in models){
                let oModel = new JSONModel(models[model]);
                this.getView().setModel(oModel, model);
                this.getView().bindElement({path: '/', 'model': model});
            }

            this.posto = new Posto.Posto();

        },

        setEstado: function(estadosAtivos){
            let estados = Object.assign({}, ESTADOS, estadosAtivos); 
            let oModel = this.getView().getModel('view');
            let view = oModel.getData();
            view.estado = estados;
            oModel.refresh();
        },

        setEstadoFromEvent: function(event, data){
            if (event=='LOCAIS_DISPONIVEIS')
                this.setEstado({semPosto:true});
            if (event=='POSTOS_INATIVOS')
                this.setEstado({semPosto:true, localSelecionado: true});
            if (event=='POSTO')
                switch (data.posto.estado){
                case ESTADOS_POSTO.EM_PAUSA:
                    this.setEstado({emPausa:true});
                    break;
                case ESTADOS_POSTO.ESPERANDO_CLIENTE:
                    this.setEstado({esperandoCliente:true});
                    break;
                case ESTADOS_POSTO.CLIENTE_CHAMADO:
                    this.setEstado({clienteChamado:true});
                    break;
                case ESTADOS_POSTO.ATENDENDO:
                    this.setEstado({atendendo:true});
                    break;
                }
        },

        onLocaisDisponiveis: function(channel, event, data){
            let oModel = this.getView().getModel('locais');
            oModel.setData(data.locais);
            oModel.refresh();

            oModel = this.getView().getModel('form');
            oModel.setData(Object.assign({},MODELS.form));
            oModel.refresh();

            this.setEstadoFromEvent(event, data);
        },

        onPosto: function(channel, event, data){
            this.addNotificacao(event, data);
            let oModel = this.getView().getModel('posto');
            oModel.setData(data.posto);
            oModel.refresh();
            this.setEstadoFromEvent(event, data);
        },

        onPostosInativos: function(channel, event, data){
            let oModel = this.getView().getModel('postos');
            oModel.setData(data.postos);
            oModel.refresh();
            this.setEstadoFromEvent(event, data);
        },

        onOcuparPosto: function(){
            let oModel = this.getView().getModel('form');
            let form = oModel.getData();
            this.posto.ocuparPosto(form.posto);
        },

        onChamarSeguinte: function(){
            this.posto.chamarSeguinte();
        },

        onCancelarChamado: function(){
            this.posto.cancelarChamado();
        },

        onFinalizarAtencao: function(){
            this.posto.finalizarAtencao();
        },

        onIndicarAusencia: function(){
            this.posto.indicarAusencia();
        },

        onAtender: function(){
            this.posto.atender();
        },

        onDesocuparPosto: function(){
            this.posto.desocuparPosto();
        },

        onAtualizar: function(){
            this.posto.getEstado();
        },

        onSelectLocal: function(){
            let oModel = this.getView().getModel('form');
            let form = oModel.getData();
            form.posto = '';
            oModel.refresh();
            this.posto.getPostosInativos(form.local);
            this.setEstado({ semPosto:true, localSelecionado:true,});

        },

        onSelectPosto: function(){
            this.setEstado({ semPosto:true, localSelecionado:true,
                postoSelecionado: true});
        },

        onItemClose: function (oEvent) {
            let oNotificacao = oEvent.getSource().getBindingContext(
                'notificacoes').getObject();
            let oModel = this.getModel('notificacoes');
            let aNotificacoes = oModel.getData();
            let index = aNotificacoes.indexOf(oNotificacao);
            aNotificacoes.splice(index, 1);
            oModel.refresh();
        },

        getDescricaoNotificacao: function(event, data){
            switch(event){
            case 'LOCAIS_DISPONIVEIS':
                return 'Selecione algum local  '+
                'para ver quais são os postos disponiveis.';
            case 'POSTO':
                return 'O estado atual do posto é: '+
                data.posto.texto_estado;
            case 'POSTOS_INATIVOS':
                return 'Por favor selecione algum dos postos '+
                    'disponiveis que deseja ocupar.';
            }
        },

        getPrioridadeDaNotificacao: function(posto){
            posto;
            return 'Low';
        },

        addNotificacao: function(event, data){
            let oModel = this.getView().getModel('notificacoes');
            let notificacoes = oModel.getData();
            notificacoes.unshift({
                title: event,
                description: this.getDescricaoNotificacao(event, data),
                datetime: String(Date()),
                priority: this.getPrioridadeDaNotificacao(data.posto),
            });
            oModel.setData(notificacoes);
            oModel.refresh();
        },


    });
});
