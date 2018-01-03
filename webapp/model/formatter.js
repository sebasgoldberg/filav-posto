sap.ui.define([
    'iamsoft/filav/posto/model/Posto',
], function (Posto) {

    'use strict';

    let ESTADOS_POSTO = Posto.ESTADOS_POSTO;

    return {

        postoHeaderTitle: function (oPosto) {
            if (!oPosto || !oPosto.fila)
                return '';
            return oPosto.nome+' - '+oPosto.fila.nome+' ('+oPosto.texto_estado+')';
        },

        postoStatusText: function (oPosto) {
            if (!oPosto)
                return '';
            return oPosto.texto_estado;
        },

        postoStatusState: function (oPosto) {
            if (!oPosto)
                return '';
            switch (oPosto.estado){
            case ESTADOS_POSTO.ESPERANDO_CLIENTE || ESTADOS_POSTO.ATENDENDO:
                return 'Success';
            case ESTADOS_POSTO.EM_PAUSA || ESTADOS_POSTO.CLIENTE_CHAMADO:
                return 'Warning';
            }
            return 'None';
        },

    };
});
