jQuery( function( $ ) {

    /**
     * After refreshing the step, make sure we are removing the placeholder if payment step
     * is the active step. Try to set current payment method to the "old" value.
     */
    $( 'body' ).bind( 'wc_gzdp_step_changed', function() {
        if ( $( '.step-wrapper-active' ).attr( 'id' ) === 'step-wrapper-payment' ) {
            var current = $( 'form.woocommerce-checkout' ).find( ".wc-gzdp-payment-method-placeholder" ).data( 'current' );

            if ( current && $( 'form.woocommerce-checkout' ).find( 'input#' + current ).length > 0 ) {
                $( 'form.woocommerce-checkout' ).find( 'input#' + current ).prop( 'checked', true );
            }

            $( 'form.woocommerce-checkout' ).find( ".wc-gzdp-payment-method-placeholder" ).remove();
        }
    });

    /**
     * On refreshing step (when submitting) add a placeholder payment_method input so that the Payone script
     * does not execute within first step for certain payment methods such as direct debit or cc.
     */
    $( document ).on( 'refresh', '.step-wrapper', function() {
        if ( $( this ).attr( 'id' ) === 'step-wrapper-payment' ) {
            // Do nothing
        } else {
            var $current = $( 'input[name=payment_method]:checked' );

            if ( $( 'form.woocommerce-checkout' ).find( '.wc-gzdp-payment-method-placeholder' ).length == 0 ) {
                var id = $current.length > 0 ? $current.attr( 'id' ) : '';
                $( 'form.woocommerce-checkout' ).append( '<input type="radio" style="display: none;" name="payment_method" data-current="' + id + '" class="wc-gzdp-payment-method-placeholder" value="placeholder" checked="checked" />' );
            }
        }
    });
});