<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

class WC_GZDP_Checkout_Compatibility_Stripe {

	public function __construct() {
		add_action( 'woocommerce_gzdp_checkout_scripts', array( $this, 'set_scripts' ), 10, 2 );
	}

	public function set_scripts( $multistep, $assets ) {
		// Multistep Checkout
		wp_register_script( 'wc-gzdp-stripe-multistep-helper', WC_germanized_pro()->plugin_url() . '/assets/js/checkout-multistep-stripe-helper' . $assets->suffix . '.js', array( 'wc-gzdp-checkout-multistep' ), WC_GERMANIZED_PRO_VERSION, true );

		// Load available Stripe Payment Gateways
		$gateways = WC()->payment_gateways->get_available_payment_gateways();
		$stripe_gateways = array();
		$stripe_processing_gateways = apply_filters( 'woocommerce_gzdp_multistep_stripe_processing_gateways', array( 'stripe', 'stripe_sepa' ) );

		foreach( $gateways as $key => $gateway ) {
			$classname = get_class( $gateway );

			// By default only credit card needs further processing.
			if ( strpos( $classname, 'WC_Gateway_Stripe' ) !== false || strpos( $classname, 'WC_Stripe' ) !== false ) {

				$stripe_gateways[ str_replace( 'stripe_', '', $gateway->id ) ] = array(
					'needs_handling' => ( in_array( $gateway->id, $stripe_processing_gateways ) ? true : false ),
					'is_selected'	 => false,
				);
			}
		}

		wp_localize_script( 'wc-gzdp-stripe-multistep-helper', 'wc_gzdp_stripe_multistep_params', array(
			'methods' => apply_filters( 'woocommerce_gzdp_multistep_stripe_gatways', $stripe_gateways ),
		) );

		wp_enqueue_script( 'wc-gzdp-stripe-multistep-helper' );
	}

}