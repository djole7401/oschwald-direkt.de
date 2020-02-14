<?php

class WC_GZDP_Privacy {

	protected static $_instance = null;

	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public function __construct() {
		add_filter( 'woocommerce_gzd_privacy_export_order_personal_metadata', array( $this, 'export_order_data' ), 10, 1 );
		add_filter( 'woocommerce_gzd_privacy_export_customer_personal_metadata', array( $this, 'export_customer_data' ), 10, 1 );

		add_filter( 'woocommerce_gzd_privacy_erase_order_personal_metadata', array( $this, 'erase_order_data' ), 10, 1 );
		add_filter( 'woocommerce_gzd_privacy_erase_customer_personal_metadata', array( $this, 'erase_customer_data' ), 10, 1 );

		add_action( 'woocommerce_privacy_remove_order_personal_data', array( $this, 'erase_invoice_data' ), 10, 1 );

		add_action( 'wp_privacy_personal_data_export_file_created', array( $this, 'export_customer_pdfs' ), 10, 4 );
	}

	public function export_customer_pdfs( $archive_pathname, $archive_url, $html_report_pathname, $request_id ) {
		// Get the request data.
		$request = wp_get_user_request_data( $request_id );

		if ( ! $request || 'export_personal_data' !== $request->action_name ) {
			return;
		}

		$email_address = $request->email;
		$user           = get_user_by( 'email', $email_address ); // Check if user has an ID in the DB to load stored personal data.
		$pdfs_to_export = array();

		$order_query    = array(
			'limit'    => -1,
			'customer' => array( $email_address ),
		);

		if ( $user instanceof WP_User ) {
			$order_query['customer'][] = (int) $user->ID;
		}

		$orders = wc_get_orders( $order_query );

		if ( 0 < count( $orders ) ) {
			foreach ( $orders as $order ) {
				if ( $invoices = wc_gzdp_get_invoices_by_order( $order ) ) {
					foreach( $invoices as $invoice ) {
						if ( $path = $invoice->get_pdf_path() ) {
							$pdfs_to_export[ $path ] = $invoice->get_filename();
						}
					}
				}
			}
		}

		if ( ! empty( $pdfs_to_export ) ) {
			// Open zipfile
			$zip = new ZipArchive;

			if ( true === $zip->open( $archive_pathname, 1 ) ) {

				foreach ( $pdfs_to_export as $pdf_path => $name ) {
					$zip->addFile( $pdf_path, $name );
				}

				$zip->close();
			}
		}
	}

	public function erase_invoice_data( $order ) {

		if ( apply_filters( 'woocommerce_gzdp_privacy_erase_invoice_data', false, $order ) ) {
			$invoices = wc_gzdp_get_invoices_by_order( $order );

			$data = array(
				'_invoice_address'          => 'text',
				'_invoice_shipping_address' => 'text',
				'_invoice_recipient'        => 'text',
			);

			if ( ! empty( $invoices ) ) {
				foreach( $invoices as $invoice ) {
					foreach( $data as $meta_key => $data_type ) {
						if ( $value = get_post_meta( $invoice->id, $meta_key, true ) ) {

							// If the value is empty, it does not need to be anonymized.
							if ( empty( $value ) || empty( $data_type ) ) {
								continue;
							}

							if ( function_exists( 'wp_privacy_anonymize_data' ) ) {
								$anon_value = wp_privacy_anonymize_data( $data_type, $value );
							} else {
								$anon_value = '';
							}

							update_post_meta( $invoice->id, $meta_key, $anon_value );
						}
					}

					update_post_meta( $invoice->id, '_invoice_anonymized', 'yes' );
				}
			}
		}
	}

	public function export_customer_data( $data ) {
		return array_merge( $data, array(
			'billing_vat_id'  => __( 'Billing VAT ID', 'woocommerce-germanized-pro' ),
			'shipping_vat_id' => __( 'Shipping VAT ID', 'woocommerce-germanized-pro' ),
		) );
	}

	public function export_order_data( $data ) {
		return array_merge( $data, array(
			'_billing_vat_id'  => __( 'Billing VAT ID', 'woocommerce-germanized-pro' ),
			'_shipping_vat_id' => __( 'Shipping VAT ID', 'woocommerce-germanized-pro' ),
		) );
	}

	public function erase_customer_data( $data ) {
		return array_merge( $data, array(
			'billing_vat_id'  => __( 'Billing VAT ID', 'woocommerce-germanized-pro' ),
			'shipping_vat_id' => __( 'Shipping VAT ID', 'woocommerce-germanized-pro' ),
		) );
	}

	public function erase_order_data( $data ) {
		return array_merge( $data, array(
			'_shipping_vat_id' => 'text',
			'_billing_vat_id'  => 'text',
		) );
	}
}

WC_GZDP_Privacy::instance();