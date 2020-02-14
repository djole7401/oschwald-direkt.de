jQuery( function( $ ) {

    /**
     * Object to handle Stripe payment forms.
     */
    var wc_gzdp_multistep_stripe_helper = {

        /**
         * Initialize e handlers and UI state.
         */
        init: function() {
            this.$form   = $( 'form.checkout' );
            this.methods = wc_gzdp_stripe_multistep_params.methods;

            this.update();

            $( document.body ).bind( 'updated_checkout', this.update );
            $( document.body ).bind( 'wc_gzdp_step_changed', this.update );
            // These events are used by Stripe to remove the hidden input
            $( document ).on( 'checkout_error', this.change );

            this.$form.on( 'change', this.change );
        },

        isStripePaymentMethodSelected: function() {
            return $( 'input[id=^payment_method_stripe]' ).is( ':checked' );
        },

        isStripePaymentMethodWithHandlingSelected: function() {
            var is_selected = false;

            $.each( wc_gzdp_multistep_stripe_helper.methods, function( key, value ) {
                var id = wc_gzdp_multistep_stripe_helper.getPaymentMethodId( key );

                if ( value.needs_handling && $( id ).is( ':checked' ) ) {
                    is_selected = true;
                }
            });

            return is_selected;
        },

        isStripePaymentMethodWithoutHandlingSelected: function() {
            var is_selected = false;

            $.each( wc_gzdp_multistep_stripe_helper.methods, function( key, value ) {
                var id = wc_gzdp_multistep_stripe_helper.getPaymentMethodId( key );

                if ( ! value.needs_handling && $( id ).is( ':checked' ) ) {
                    is_selected = true;
                }
            });

            return is_selected;
        },

        getPaymentMethodId: function( method_name ) {
            return 'input#payment_method_stripe' + ( method_name != 'stripe' ? '_' + method_name : '' );
        },

        /**
         * Appends a hidden input if necessary to prevent Stripe from executing payment within a wrong step.
         */
        preventEarlyStripeExecution: function() {
            if ( $( '#step-wrapper-order' ).hasClass( 'step-wrapper-active' ) ) {
                wc_gzdp_multistep_stripe_helper.$form.find( '.wc-gzdp-stripe-token-fix' ).remove();
            } else if( $( '#step-wrapper-payment' ).hasClass( 'step-wrapper-active' ) && wc_gzdp_multistep_stripe_helper.isStripePaymentMethodWithHandlingSelected() ) {
                wc_gzdp_multistep_stripe_helper.$form.find( '.wc-gzdp-stripe-token-fix' ).remove();
            } else if ( wc_gzdp_multistep_stripe_helper.isStripePaymentMethodWithoutHandlingSelected() || wc_gzdp_multistep_stripe_helper.isStripePaymentMethodWithHandlingSelected() ) {
                if ( wc_gzdp_multistep_stripe_helper.$form.find( '.wc-gzdp-stripe-token-fix' ).length == 0 ) {
                    wc_gzdp_multistep_stripe_helper.$form.append( '<input type="hidden" name="stripe_token" class="stripe_token wc-gzdp-stripe-token-fix" />' );
                }
            }
        },

        change: function() {
            wc_gzdp_multistep_stripe_helper.preventEarlyStripeExecution();
        },

        update: function() {
            wc_gzdp_multistep_stripe_helper.preventEarlyStripeExecution();
        }
    };

    wc_gzdp_multistep_stripe_helper.init();

});