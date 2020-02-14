<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! class_exists( 'WC_GZDP_Email_Customer_Invoice_Cancellation' ) ) :

/**
 * Customer Invoice
 *
 * An email sent to the customer via admin.
 *
 * @class 		WC_Email_Customer_Invoice
 * @version		2.0.0
 * @package		WooCommerce/Classes/Emails
 * @author 		WooThemes
 * @extends 	WC_Email
 */
class WC_GZDP_Email_Customer_Invoice_Cancellation extends WC_Email {

	public $invoice;

	/**
	 * Constructor
	 */
	public function __construct() {

		$this->id             = 'customer_invoice_cancellation';
		$this->title          = _x( 'Customer invoice cancellation', 'invoices', 'woocommerce-germanized-pro' );
		$this->description    = _x( 'Email contains the cancellation to an invoice/order.', 'invoices', 'woocommerce-germanized-pro' );

		$this->template_html  = 'emails/customer-invoice-cancellation.php';
		$this->template_plain = 'emails/plain/customer-invoice-cancellation.php';

		if ( property_exists( $this, 'placeholders' ) ) {
			$this->placeholders   = array(
				'{site_title}'            => $this->get_blogname(),
				'{invoice_number_parent}' => '',
				'{invoice_number}'        => '',
			);
		}

		// Call parent constructor
		parent::__construct();

		$this->customer_email = true;
	}

	/**
	 * trigger function.
	 *
	 * @access public
	 * @return void
	 */
	public function trigger( $object ) {
		if ( is_callable( array( $this, 'setup_locale' ) ) ) {
			$this->setup_locale();
		}

		if ( ! is_object( $object ) ) {
			$object = get_post( $object );
			if ( $object->post_type == 'shop_order' )
				$object = wc_get_order( $object->ID );
			elseif ( $object->post_type == 'invoice' )
				$object = wc_gzdp_get_invoice( $object->ID );
		}

		if ( is_object( $object ) ) {
			
			$this->object = $object;
			
			// Look for the actual invoice
			if ( $object instanceof WC_Order ) {
				if ( $object->invoices ) {
					foreach ( $object->invoices as $invoice ) {
						$invoice = wc_gzdp_get_invoice( $invoice );
						if ( $invoice->is_type( 'cancellation' ) ) {
							$this->object = $invoice;
							break;
						}
					}
				}
			}

			if ( $this->object instanceof WC_GZDP_Invoice ) {
				$recipient 			= $this->object->recipient;
				$this->recipient	= $recipient['mail'];

				if ( property_exists( $this, 'placeholders' ) ) {
					$this->placeholders['{invoice_number_parent}'] = $this->object->parent->get_title();
					$this->placeholders['{invoice_number}']        = $this->object->get_title();
				} else {
					$this->find['invoice-number-parent']    = '{invoice_number_parent}';
					$this->find['invoice-number']    		= '{invoice_number}';
					$this->replace['invoice-number-parent'] = $this->object->parent->get_title();
					$this->replace['invoice-number'] 		= $this->object->get_title();
				}

				$this->object->mark_as_sent();
			}
		}

		if ( $this->is_enabled() && $this->get_recipient() ) {
			$this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );
		}

		if ( is_callable( array( $this, 'restore_locale' ) ) ) {
			$this->restore_locale();
		}
	}

	/**
	 * get_subject function.
	 *
	 * @access public
	 * @return string
	 */
	public function get_subject() {
		return apply_filters( 'woocommerce_email_subject_customer_invoice_cancellation', $this->format_string( $this->get_option( 'subject', $this->get_default_subject() ) ), $this->object );
	}

	public function get_default_subject() {
		return _x( '{invoice_number} to {invoice_number_parent}', 'invoices', 'woocommerce-germanized-pro' );
	}

	/**
	 * get_heading function.
	 *
	 * @access public
	 * @return string
	 */
	public function get_heading() {
		return apply_filters( 'woocommerce_email_heading_customer_invoice_cancellation', $this->format_string( $this->get_option( 'heading', $this->get_default_heading() ) ), $this->object );
	}

	public function get_default_heading() {
		return _x( '{invoice_number} to {invoice_number_parent}', 'invoices', 'woocommerce-germanized-pro' );
	}

	public function get_attachments() {
		$attachments = parent::get_attachments();
		array_push( $attachments, $this->object->get_pdf_path() );
		return $attachments;
	}

	/**
	 * get_content_html function.
	 *
	 * @access public
	 * @return string
	 */
	public function get_content_html() {
		ob_start();
		wc_get_template( $this->template_html, array(
			'invoice' 		=> $this->object,
			'email_heading' => $this->get_heading(),
			'sent_to_admin' => false,
			'plain_text'    => false,
			'email'			=> $this
		) );
		return ob_get_clean();
	}

	/**
	 * get_content_plain function.
	 *
	 * @access public
	 * @return string
	 */
	public function get_content_plain() {
		ob_start();
		wc_get_template( $this->template_plain, array(
			'invoice' 		=> $this->object,
			'email_heading' => $this->get_heading(),
			'sent_to_admin' => false,
			'plain_text'    => true,
			'email'			=> $this
		) );
		return ob_get_clean();
	}

	public function init_form_fields() {

		parent::init_form_fields();

		$this->form_fields[ 'subject' ][ 'description' ] = sprintf( __( 'Available placeholders: %s', 'woocommerce-germanized-pro' ), '<code>{invoice_number}, {invoice_number_parent}</code>' );
		$this->form_fields[ 'heading' ][ 'description' ] = sprintf( __( 'Available placeholders: %s', 'woocommerce-germanized-pro' ), '<code>{invoice_number}, {invoice_number_parent}</code>' );

	}
}

endif;

return new WC_GZDP_Email_Customer_Invoice_Cancellation();