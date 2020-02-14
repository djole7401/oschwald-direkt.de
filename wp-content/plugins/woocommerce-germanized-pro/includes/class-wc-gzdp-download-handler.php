<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Download handler
 *
 * Handle digital downloads.
 *
 * @class 		WC_Download_Handler
 * @version		2.2.0
 * @package		WooCommerce/Classes
 * @category	Class
 * @author 		WooThemes
 */
class WC_GZDP_Download_Handler {

	/**
	 * Hook in methods
	 */
	public static function init() {
		add_action( 'template_redirect', array( __CLASS__, 'download_invoice' ) );
	}

	/**
	 * Check if we need to download a file and check validity
	 */
	public static function download_invoice() {
		global $wp;
		
		if ( isset( $wp->query_vars[ 'view-bill' ] ) ) {
		
			$invoice_id = absint( $wp->query_vars[ 'view-bill' ] );
		
			if ( ! empty( $invoice_id ) ) {
		
				$invoice = wc_gzdp_get_invoice( $invoice_id );
		
				if ( $invoice ) {
					
					$order_id = $invoice->order;
					
					if ( ! current_user_can( 'edit_shop_orders' ) && ! current_user_can( 'view_order', $order_id ) )
						wp_die( __( 'Cheatin huh?', 'woocommerce-germanized-pro' ) );
					
					self::download( $invoice );
				}
			}
		}
	}

	public static function download( $pdf, $force = false ) {
		
		if ( ! $pdf->has_attachment() || ! file_exists( $pdf->get_pdf_path() ) )
			wp_die( __( 'This file does not exist', 'woocommerce-germanized-pro' ) );
		
		$file = $pdf->get_pdf_path();
		$filename = $pdf->get_filename();
		
		self::out( $filename, $file, $force );
	}

	public static function out( $filename, $path, $force ) {
		self::check_server_config();
		self::clean_buffers();
		header( 'Content-type: application/pdf' );
		header( 'Content-Disposition: ' . ( ( get_option( 'woocommerce_gzdp_invoice_download_force' ) == 'yes' || $force ) ? 'attachment' : 'inline' ) . '; filename="' . $filename . '"' );
		header( 'Content-Transfer-Encoding: binary' );
		if ( $size = @filesize( $path ) ) {
			header( "Content-Length: " . $size );
		}
		@readfile( $path );
		exit();
	}

	/**
	 * Check and set certain server config variables to ensure downloads work as intended.
	 */
	private static function check_server_config() {
		if ( function_exists( 'wc_set_time_limit' ) ) {
			wc_set_time_limit( 0 );
		}
		if ( function_exists( 'get_magic_quotes_runtime' ) && get_magic_quotes_runtime() && version_compare( phpversion(), '5.4', '<' ) ) {
			set_magic_quotes_runtime( 0 );
		}
		if ( function_exists( 'apache_setenv' ) ) {
			@apache_setenv( 'no-gzip', 1 );
		}
		@ini_set( 'zlib.output_compression', 'Off' );
		@session_write_close();
	}

	/**
	 * Clean all output buffers.
	 *
	 * Can prevent errors, for example: transfer closed with 3 bytes remaining to read.
	 *
	 * @access private
	 */
	private static function clean_buffers() {
		if ( ob_get_level() ) {
			$levels = ob_get_level();
			for ( $i = 0; $i < $levels; $i++ ) {
				@ob_end_clean();
			}
		} else {
			@ob_end_clean();
		}
	}
}

WC_GZDP_Download_Handler::init();
