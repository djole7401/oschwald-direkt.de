jQuery( function( $ ) {

    $( document ).on( 'change', '#billing_vat_id, #shipping_vat_id', function() {
        $( '.woocommerce-error, .woocommerce-message' ).remove();
        $( 'body' ).trigger( 'update_checkout' );
    });

    $( document ).on( 'change', '#ship-to-different-address-checkbox', function() {
        if ( $( this ).is( ':checked' ) ) {
            // Use placeholder value to make sure billing vat id wont throw empty errors
            $( '#billing_vat_id' ).val( '1' ).parents( '.form-row' ).hide();
        } else {
            // Remove placeholder value
            $( '#billing_vat_id' ).val( '' ).parents( '.form-row' ).hide();

            var $wrapper    = $('.woocommerce-billing-fields');
            var country     = $( '#billing_country' ).val();

            $( document.body ).trigger( 'country_to_state_changing', [ country, $wrapper ] );
        }
    });

    $( document ).on( 'change', '#billing_country', function() {
        if ( $( '#ship-to-different-address-checkbox' ).is( ':checked' ) ) {
            $( '#billing_vat_id' ).val( '1' ).parents( '.form-row' ).hide();
        }
    });
});