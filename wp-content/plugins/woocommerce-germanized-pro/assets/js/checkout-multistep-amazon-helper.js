jQuery( function( $ ) {

	if ( 'amazon_payments_advanced' === $( 'input[name=payment_method]:checked' ).val() ) {

		$( '#amazon_customer_details .col2-set .col-2' ).appendTo( '#order-payment' );
		// Insert before customer_details because amazon gateway detaches all inputs within customer_details on checkout_updated
        $( '#amazon_customer_details' ).insertBefore( '#customer_details ' );
		$( '#customer_details > .col-1' ).hide();
		$( '#customer_details > .col-2' ).hide();
		$( '#order-payment > .col-2 > h3' ).hide();

		$( 'body' ).on( 'wc_gzdp_step_changed', function() {
			$( '.woocommerce-gzpd-checkout-verify-data .addresses address' ).text( amazon_helper.managed_by );
		});

	}

});