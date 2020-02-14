<?php
/**
 * WPML Helper
 *
 * Specific configuration for WPML
 *
 * @class 		WC_GZD_WPML_Helper
 * @category	Class
 * @author 		vendidero
 */
class WC_GZDP_WPML_Helper {

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) )
			self::$_instance = new self();

		return self::$_instance;
	}

	public function __construct() {
		
		if ( ! $this->is_activated() ) 
			return;

		add_action( 'init', array( $this, 'init' ), 10 );
	}

	public function init() {
		add_filter( 'woocommerce_gzd_wpml_translatable_options', array( $this, 'get_translatable_options' ), 10, 1 );

		add_action( 'woocommerce_gzdp_invoice_language_update', array( $this, 'observe_invoice_language_update' ), 0, 2 );
		add_action( 'woocommerce_gzd_wpml_lang_changed', array( $this, 'reload_locale' ) );
		add_action( 'woocommerce_gzdp_before_invoice_refresh', array( $this, 'add_invoice_translatable' ), 10, 1 );

		add_action( 'woocommerce_gzdp_invoice_maybe_update_language', array( $this, 'maybe_update_languages' ), 10, 2 );

		// Multistep step name refresh after init
		$this->refresh_step_names();
	}

	public function get_translatable_options( $options ) {
		$gzdp_options = array(
			'woocommerce_gzdp_contract_helper_email_order_processing_text' => '',
			'woocommerce_gzdp_invoice_address'                             => '',
			'woocommerce_gzdp_invoice_address_detail'                      => '',
			'woocommerce_gzdp_invoice_text_before_table'                   => '',
			'woocommerce_gzdp_invoice_text_after_table'                    => '',
			'woocommerce_gzdp_invoice_number_format'                       => '',
			'woocommerce_gzdp_invoice_cancellation_number_format'          => '',
			'woocommerce_gzdp_invoice_packing_slip_number_format'          => '',
			'woocommerce_gzdp_invoice_cancellation_text_before_table'      => '',
			'woocommerce_gzdp_invoice_cancellation_text_after_table'       => '',
			'woocommerce_gzdp_invoice_packing_slip_text_before_table'      => '',
			'woocommerce_gzdp_invoice_packing_slip_text_after_table'       => '',
			'woocommerce_gzdp_invoice_reverse_charge_text'                 => '',
			'woocommerce_gzdp_checkout_step_title_address'                 => '',
			'woocommerce_gzdp_checkout_step_title_payment'                 => '',
			'woocommerce_gzdp_checkout_step_title_order'                   => '',
			'woocommerce_gzdp_legal_page_text_before_content'              => '',
			'woocommerce_gzdp_legal_page_text_after_content'               => '',
			'woocommerce_gzdp_checkout_privacy_policy_text'                => '',
			'woocommerce_gzdp_invoice_third_party_country_text'            => '',
			'woocommerce_gzdp_invoice_differential_taxation_notice_text'   => '',
			'woocommerce_gzdp_invoice_page_numbers_format'                 => '',
			'woocommerce_gzdp_legal_page_page_numbers_format'              => '',
		);

		return array_merge( $gzdp_options, $options );
	}

	public function maybe_update_languages( $invoice, $order ) {
		$lang = null;

		if ( $lang = get_post_meta( wc_gzd_get_crud_data( $order, 'id' ), 'wpml_language', true ) ) {
			update_post_meta( $invoice->id, 'wpml_language', $lang );
			do_action( 'woocommerce_gzdp_invoice_language_update', $invoice, $lang );
		}
	}

	public function refresh_step_names() {
		if ( isset( WC_germanized_pro()->multistep_checkout ) ) {

			$step_names = WC_germanized_pro()->multistep_checkout->get_step_names();
			$steps = WC_germanized_pro()->multistep_checkout->steps;

			foreach ( $steps as $key => $step ) {
				$step->title = $step_names[ $step->id ];
			}
		}
	}

	public function add_invoice_translatable( $invoice ) {
		global $sitepress;
		
		if ( function_exists( 'wpml_add_translatable_content' ) )
			wpml_add_translatable_content( 'post_invoice', $invoice->id, ( get_post_meta( $invoice->id, 'wpml_language', true ) ) ? get_post_meta( $invoice->id, 'wpml_language', true ) : $sitepress->get_default_language() );
	}

	public function reload_locale( $lang ) {
		WC_germanized_pro()->load_plugin_textdomain();
	}

	public function observe_invoice_language_update( $invoice, $language ) {
		$lang = null;

		if ( $lang = get_post_meta( $invoice->id, 'wpml_language', true ) ) {
			if ( class_exists( 'WC_GZD_WPML_Helper' ) ) {
				WC_GZD_WPML_Helper::instance()->set_language( $lang );
			} else {
				WC_germanized()->compatibilities[ 'wpml' ]->set_language( $lang );
			}
		}
	}

	public function is_activated() {
		return WC_GZDP_Dependencies::instance()->is_wpml_activated();
	}

}

return WC_GZDP_WPML_Helper::instance();