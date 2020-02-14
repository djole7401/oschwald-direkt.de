<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

class WC_GZDP_Theme_Enfold extends WC_GZDP_Theme {

	public function __construct( $template ) {
		parent::__construct( $template );

		add_filter( 'avia_load_shortcodes', array( $this, 'filter_shortcodes' ), 100, 1 );
	}

	public function filter_shortcodes( $paths )  {
	    $paths = array_merge( $paths, array( WC_germanized_pro()->plugin_path() . '/themes/enfold/shortcodes/' ) );
	    return $paths;
    }

	public function set_priorities() {
		$this->priorities = array(

		);
	}

	public function custom_hooks() {
		
		// Single Product unit price + legal info
		if ( has_action( 'woocommerce_single_product_summary', 'woocommerce_gzd_template_single_price_unit' ) )
			add_action( 'wc_gzdp_single_product_legal_price_info', 'woocommerce_gzd_template_single_price_unit', 0 );
		if ( has_action( 'woocommerce_single_product_summary', 'woocommerce_gzd_template_single_legal_info' ) )
			add_action( 'wc_gzdp_single_product_legal_price_info', 'woocommerce_gzd_template_single_legal_info', 1 );

		// Remove GZD Actions
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_gzd_template_single_price_unit', wc_gzd_get_hook_priority( 'single_price_unit' ) );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_gzd_template_single_legal_info', wc_gzd_get_hook_priority( 'single_legal_info' ) );

		// If minimal-overlay has been chosen we need to insert info within the link - need to remove the additional shipping costs link for HTML compatibility
		if ( function_exists( 'avia_get_option' ) && 'minimal-overlay' === avia_get_option( 'product_layout' ) ) {

			if ( has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_tax_info' ) )
				add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_gzd_template_single_tax_info', 20 );
			if ( has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_shipping_costs_info' ) )
				add_action( 'woocommerce_after_shop_loop_item_title', array( $this, 'custom_shipping_costs_notice' ), 30 );
			if ( has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_delivery_time_info' ) )
				add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_gzd_template_single_delivery_time_info', 40 );
			if ( has_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_product_units' ) )
				add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_gzd_template_single_product_units', 50 );

			// Remove Shop Loop Information
			remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_shipping_costs_info', wc_gzd_get_hook_priority( 'loop_shipping_costs_info', false ) );
			remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_delivery_time_info', wc_gzd_get_hook_priority( 'loop_delivery_time_info', false ) );
			remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_tax_info', wc_gzd_get_hook_priority( 'loop_tax_info', false ) );
			remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_gzd_template_single_product_units', wc_gzd_get_hook_priority( 'loop_product_units', false ) );

		} else {
			// By default: Add a new container for Germanized info
			add_action( 'woocommerce_after_shop_loop_item', array( $this, 'open_loop_wrapper' ), ( wc_gzd_get_hook_priority( 'loop_tax_info' ) - 1 ) );
			add_action( 'woocommerce_after_shop_loop_item', array( $this, 'close_loop_wrapper' ), ( wc_gzd_get_hook_priority( 'loop_delivery_time_info' ) + 1 ) );
		}

		// Footer info
		$this->footer_init();
		remove_action ( 'wp_footer', 'woocommerce_gzd_template_footer_vat_info', wc_gzd_get_hook_priority( 'footer_vat_info' ) );
		remove_action ( 'wp_footer', 'woocommerce_gzd_template_footer_sale_info', wc_gzd_get_hook_priority( 'footer_sale_info' ) );

		// Avada Builder Loop Product Info
		add_filter( 'avf_masonry_loop_prepare', array( $this, 'masonry_loop_products' ), 10, 2 );

	}

	public function custom_shipping_costs_notice() {
		if ( 'minimal-overlay' === avia_get_option( 'product_layout' ) ) {
			add_filter( 'woocommerce_gzd_shipping_costs_text', array( $this, 'remove_shipping_costs_html' ), 10, 2 );
		}

		woocommerce_gzd_template_single_shipping_costs_info();
	}

	public function remove_shipping_costs_html( $html, $product ) {
		return strip_tags( $html );
	}

	public function masonry_loop_products( $entry, $query ) {

		if ( ! isset( $entry['post_type'] ) || 'product' !== $entry['post_type'] )
			return $entry;

		ob_start();

		WC_GZDP_Theme_Helper::instance()->manually_embed_product_loop_hooks( $entry[ 'ID' ] );
		do_action( 'woocommerce_gzd_loop_product_info' );

		$html = ob_get_clean();

		// Remove href-links because not supported by mansory
		$entry[ 'text_after' ] .= '<div class="enfold-gzd-loop-info">' . strip_tags( $html, '<del><p><div><span>' ) . '</div>';
		return $entry;
	}

	public function open_loop_wrapper() {
		echo '<div class="inner_product_header inner_product_header_legal">';
	}

	public function close_loop_wrapper() {
		echo '</div>';
	}

	public function footer_init() {
		
		global $avia;

		if ( isset( $avia->options[ 'avia' ][ 'copyright' ] ) ) {
			if ( has_action( 'wp_footer', 'woocommerce_gzd_template_footer_vat_info' ) )
				$avia->options[ 'avia' ][ 'copyright' ] .= '[nolink]' . do_shortcode( '[gzd_vat_info]' );
			if ( has_action( 'wp_footer', 'woocommerce_gzd_template_footer_sale_info' ) )
				$avia->options[ 'avia' ][ 'copyright' ] .= '[nolink]' . do_shortcode( '[gzd_sale_info]' );
		}

	}

}