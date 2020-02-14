jQuery( function( $ ) {

	// Support other Payment Plugins - just add a wrap around their custom payment wrapper
	if ( $( '#payment-manual' ).length ) {
		$( '#payment-manual' ).wrap( '<div id="order-payment"></div>' );
		$( '#order_payment_heading' ).insertBefore( '#payment-manual' );
	} else {
		$( '#payment' ).wrap( '<div id="order-payment"></div>' );
		$( '#order_payment_heading' ).insertBefore( '#payment' );
	}

	$( '#order_review > #order-payment ~ *' ).wrapAll( '<div id="order-verify"></div>' );

	$( '#order_review_heading' ).prependTo( '#order-verify' );

	$.each( steps, function( index, elem ) {
		
		if ( $( elem.selector ).length )  {
			
			// Wrap selector with step-wrapper
			$( elem.selector ).wrap( '<div class="' + multistep.wrapper + ' ' + elem.wrapper_classes.join( ' ' ) +  '" id="step-wrapper-' + elem.id +  '" data-id="' + elem.id +  '"></div>' );
			
			if ( elem.submit_html )
				$( '#step-wrapper-' + elem.id ).append( elem.submit_html );

		}

	});

	$( '.step-wrapper' ).hide();

	// Listen to AJAX Events to check whether fragments can be refreshed (data check within last step).
    $( document ).ajaxComplete( function( ev, jqXHR, settings ) {
        if ( jqXHR != null && jqXHR.hasOwnProperty('responseJSON') && jqXHR.responseJSON.hasOwnProperty('fragments') ) {

        	// Check if fragment exists in object
            if ( jqXHR.responseJSON.fragments.hasOwnProperty( '.woocommerce-gzpd-checkout-verify-data' ) ) {

                $( '.woocommerce-gzpd-checkout-verify-data' ).replaceWith( jqXHR.responseJSON.fragments['.woocommerce-gzpd-checkout-verify-data'] );
                $( '.step-nav' ).replaceWith( jqXHR.responseJSON.fragments['.step-nav'] );

                $( 'ul.step-nav li a' ).each( function() {
                    var id = $( this ).data( 'href' );

                    if ( jqXHR.responseJSON.fragments.hasOwnProperty( '.step-buttons-' + id ) ) {
                        $( '.step-buttons-' + id ).replaceWith( jqXHR.responseJSON.fragments['.step-buttons-' + id] );
                    }
                });
            }
        }
    });

	$( document ).on( 'click', '.step, .step-trigger', function() {

		if ( ! $( this ).attr( 'href' ) )
			return false;

		var step = $( this ).data( 'href' );

		$( 'body' ).trigger( 'wc_gzdp_show_step', $( this ) );

		$( '.step-' + step ).trigger( 'change', $( this ) );

	});

	$( document ).on( 'change', '.step', function( e, elem ) {
        var id = $( this ).data( 'href' );

        if ( $( '#step-wrapper-' + id ).length ) {

            if ( elem !== undefined )
                $( '.woocommerce-error' ).remove();

            $( '.step-nav' ).find( '.active' ).removeClass( 'active' );
            $( this ).parents( 'li' ).addClass( 'active' );

            $( this ).attr( 'href', '#step-' + $( this ).data( 'href' ) );

            $( '.step-wrapper' ).hide();
            $( '.step-wrapper' ).removeClass( 'step-wrapper-active' );
            $( '#step-wrapper-' + id ).show();
            $( '#step-wrapper-' + id ).addClass( 'step-wrapper-active' );

            $( 'body' ).removeClass( function ( index, className ) {
                return ( className.match( /(^|\s)woocommerce-multistep-checkout-active-\S+/g ) || [] ).join(' ');
            });

            $( 'body' ).addClass( 'woocommerce-multistep-checkout-active-' + id );
            $( 'body' ).trigger( 'wc_gzdp_step_changed', $( this ) );
        }
	});

	$( '.step-nav li a.step:first' ).trigger( 'change' );

	$( document ).on( 'refresh', '.step-wrapper', function() {
        if ( $( this ).find( '.step-buttons' ).length ) {
            $( this ).find( '.step-buttons' ).prepend( '<input type="hidden" id="wc-gzdp-step-submit" name="wc_gzdp_step_submit" value="' + $( this ).data( 'id' ) + '" />' );

            $( 'body' ).bind( 'checkout_error', function(e) {

                $( '#wc-gzdp-step-submit' ).remove();

                $( 'body' ).trigger( 'wc_gzdp_step_refreshed' );
                $( 'body' ).unbind( 'checkout_error' );
            });
        }
	});

	$( document ).on( 'click', '.next-step-button', function(e) {

		var next = $( this ).data( 'next' );
		var current = $( this ).data( 'current' );	

		if ( $( this ).parents( '.step-wrapper' ).hasClass( 'no-ajax' ) ) {

			$( '.step-' + next ).trigger( 'change', $( '.step-' + next ) );
			
			// Stop auto ajax reload
			e.preventDefault();
			e.stopPropagation();

		} else {

			$( document.body ).bind( 'updated_checkout', function() {

				if ( $( document ).find( '.woocommerce-checkout-payment .blockUI' ).length )
					$( document ).find( '.woocommerce-checkout-payment' ).unblock();

			});

			$( this ).parents( '.step-wrapper' ).trigger( 'refresh' );

			$( 'body' ).bind( 'wc_gzdp_step_refreshed', function() {

				if ( $( '.woocommerce-error' ).length == 0 ) {

					// next step
					$( '.step-' + next ).trigger( 'change', $( '.step-' + next ) );

				}

				$( 'body' ).unbind( 'wc_gzdp_step_refreshed' );

			});

		}

	});

	/*
	$( document.body ).bind( 'checkout_error', function( data ) {
		$( 'html, body' ).animate({
			scrollTop: ( $( '.step-nav' ).offset().top - 50 )
		}, 500 );
	});
	*/

});