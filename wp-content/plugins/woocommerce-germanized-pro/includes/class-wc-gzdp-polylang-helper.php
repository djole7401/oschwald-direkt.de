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
class WC_GZDP_PolyLang_Helper {

	protected static $_instance = null;

	private $polylang_comp = null;

	public static function instance() {

		if ( is_null( self::$_instance ) )
			self::$_instance = new self();

		return self::$_instance;
	}

	public function __construct() {
		add_action( 'woocommerce_gzd_polylang_compatibility_loaded', array( $this, 'init' ), 10, 1 );
	}

	public function init( $polylang_comp ) {

		$this->polylang_comp = $polylang_comp;

		add_filter( 'woocommerce_gzd_polylang_order_emails', array( $this, 'set_order_emails' ), 10, 1 );
		add_filter( 'woo-poly.Emails.orderFindReplaceFind', array( $this, 'find_invoice_data' ), 10, 2 );
		add_filter( 'woo-poly.Emails.orderFindReplaceReplace', array( $this, 'replace_invoice_data' ), 10, 2 );

		add_action( 'woo-poly.Emails.switchLanguage', array( $this, 'unload_textdomain' ), 10 );
		add_action( 'woo-poly.Emails.afterSwitchLanguage', array( $this, 'reload_textdomain' ), 10 );

		add_action( 'woocommerce_gzdp_invoice_maybe_update_language', array( $this, 'maybe_update_language' ), 10, 2 );
	}

	public function maybe_update_language( $invoice, $order ) {
		$lang = pll_get_post_language( wc_gzd_get_crud_data( $order, 'id' ) );

		// Set Invoice Language
		pll_set_post_language( $invoice->id, $lang );

		$pll = $this->polylang_comp->get_pll_email_instance();

		// Maybe switch language
		if ( $pll && method_exists( $pll, 'switchLanguage' ) )
			$pll->switchLanguage( $lang );
	}

	public function unload_textdomain() {
		unload_textdomain('woocommerce-germanized-pro' );
	}

	public function reload_textdomain() {
		WC_germanized_pro()->load_plugin_textdomain();
	}

	public function find_invoice_data( $find, $object ) {
		$find[ 'invoice-number' ] = '{invoice_number}';
		$find[ 'invoice-number-parent' ] = '{invoice_number_parent}';

		return $find;
	}

	public function replace_invoice_data( $replace, $object ) {

		$invoice = null;

		// Look for the actual invoice
		if ( $object instanceof WC_Order ) {
			// Check if there are invoices
			$invoice = wc_gzdp_get_order_last_invoice( $object );
		}

		if ( ! is_a( $invoice, 'WC_GZDP_Invoice' ) )
			return $replace;

		$replace[ 'invoice-number' ] = $invoice->get_title();

		if ( $invoice->parent ) {
			$replace[ 'invoice-number-parent' ] = $invoice->parent->get_title();
		}

		return $replace;
	}

	public function set_order_emails( $emails ) {

		$gzdp_emails = array(
			'customer_invoice_cancellation',
			'customer_order_confirmation',
		);

		return array_merge( $emails, $gzdp_emails );
	}
}

return WC_GZDP_PolyLang_Helper::instance();