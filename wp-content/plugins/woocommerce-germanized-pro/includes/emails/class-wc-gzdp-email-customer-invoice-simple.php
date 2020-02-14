<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! class_exists( 'WC_GZDP_Email_Customer_Invoice_Simple' ) ) :

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
class WC_GZDP_Email_Customer_Invoice_Simple extends WC_Email {

	public $send_pdf = true;
	public $invoice;

	public $template_html_no_pdf;
	public $template_plain_no_pdf;

	/**
	 * Constructor
	 */
	public function __construct() {

		$this->id             		= 'customer_invoice';

		$this->title          		= _x( 'Customer invoice', 'invoices', 'woocommerce-germanized-pro' );
		$this->description    		= _x( 'Customer invoice emails can be sent to the user containing PDF invoice as attachment.', 'invoices', 'woocommerce-germanized-pro' );

		$this->template_html  		= 'emails/customer-invoice-simple.php';
		$this->template_html_no_pdf = 'emails/customer-invoice.php';

		$this->template_plain  		 = 'emails/plain/customer-invoice-simple.php';
		$this->template_plain_no_pdf = 'emails/plain/customer-invoice.php';

		if ( property_exists( $this, 'placeholders' ) ) {
			$this->placeholders   = array(
				'{site_title}'   => $this->get_blogname(),
				'{order_number}' => '',
				'{order_date}'   => '',
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

		// Make it an object if not yet
		if ( ! is_object( $object ) ) {
			$object = get_post( $object );
			
			if ( $object->post_type == 'shop_order' ) {
				$object = wc_get_order( $object->ID );
			} elseif( $object->post_type == 'invoice' ) {
				$object = wc_gzdp_get_invoice( $object->ID );
			}
		}

		if ( is_object( $object ) ) {
			// Look for the actual invoice
			if ( is_a( $object, 'WC_Order' ) ) {
				$this->send_pdf = false;
				$this->object   = $object;

				// Check if there are invoices
				$this->invoice = wc_gzdp_get_order_last_invoice( $object );

				if ( ! is_null( $this->invoice ) ) {
                    $this->send_pdf = true;
                }
			} else {
				$this->send_pdf = true;
				$this->object   = wc_get_order( $object->order );
				$this->invoice  = $object;
			}

			if ( $this->send_pdf ) {
				$recipient 			= $this->invoice->recipient;
				$this->recipient	= $recipient['mail'];
				$order_data 		= $this->invoice->order_data;

				if ( is_a( $this->object, 'WC_Order' ) ) {
					$order_email = wc_gzd_get_crud_data( $this->object, 'billing_email' );

					if ( ! empty( $order_email ) ) {
						$this->recipient = $order_email;
					}
				}

				if ( property_exists( $this, 'placeholders' ) ) {
					$this->placeholders['{invoice_number}'] = $this->invoice->get_title();
					$this->placeholders['{order_date}']     = date_i18n( wc_date_format(), strtotime( $order_data['date'] ) );
					$this->placeholders['{order_number}']   = $this->invoice->get_order_number();
				} else {
					$this->find['order-date']        = '{order_date}';
					$this->find['order-number']      = '{order_number}';
					$this->find['invoice-number']    = '{invoice_number}';
					$this->replace['order-date']     = date_i18n( wc_date_format(), strtotime( $order_data['date'] ) );
					$this->replace['order-number']   = $this->invoice->get_order_number();
					$this->replace['invoice-number'] = $this->invoice->get_title();
				}

				$this->invoice->mark_as_sent();
			} else {
				$this->recipient               = wc_gzd_get_crud_data( $this->object, 'billing_email' );

				if ( property_exists( $this, 'placeholders' ) ) {
					$this->placeholders['{order_date}']     = wc_gzd_get_order_date( $this->object, wc_date_format() );
					$this->placeholders['{order_number}']   = $this->object->get_order_number();
				} else {
					$this->find['order-date']      = '{order_date}';
					$this->find['order-number']    = '{order_number}';
					$this->replace['order-date']   = wc_gzd_get_order_date( $this->object, wc_date_format() );
					$this->replace['order-number'] = $this->object->get_order_number();
				}
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
		if ( $this->send_pdf ) {
			return apply_filters( 'woocommerce_email_subject_customer_invoice', $this->format_string( $this->get_option( 'subject', $this->get_default_subject( true ) ) ), $this->object );
		} else {
			return apply_filters( 'woocommerce_email_subject_customer_invoice_no_pdf', $this->format_string( $this->get_option( 'subject_no_pdf', $this->get_default_subject( false ) ) ), $this->object );
		}
	}

	/**
	 * Get email subject.
	 *
	 * @since  3.1.0
	 * @return string
	 */
	public function get_default_subject( $pdf = true ) {
		if ( $pdf ) {
			return _x( '{invoice_number} for order {order_number} from {order_date}', 'invoices', 'woocommerce-germanized-pro' );
		} else {
			return _x( 'Invoice for order {order_number} from {order_date}', 'invoices', 'woocommerce-germanized-pro' );
		}
	}

	/**
	 * get_heading function.
	 *
	 * @access public
	 * @return string
	 */
	public function get_heading() {
		if ( $this->send_pdf ) {
			return apply_filters( 'woocommerce_email_heading_customer_invoice', $this->format_string( $this->get_option( 'heading', $this->get_default_heading( true ) ) ), $this->object );
		} else {
			return apply_filters( 'woocommerce_email_heading_customer_invoice_no_pdf', $this->format_string( $this->get_option( 'heading_no_pdf', $this->get_default_heading( false ) ) ), $this->object );
		}
	}

	public function get_default_heading( $pdf = true ) {
		if ( $pdf ) {
			return _x( '{invoice_number} for order {order_number}', 'invoices', 'woocommerce-germanized-pro' );
		} else {
			return _x( 'Invoice for order {order_number}', 'invoices', 'woocommerce-germanized-pro' );
		}
	}

	public function get_attachments() {
		$attachments = parent::get_attachments();
		
		if ( $this->invoice )
			array_push( $attachments, $this->invoice->get_pdf_path() );
		
		return $attachments;
	}

	/**
	 * get_content_html function.
	 *
	 * @access public
	 * @return string
	 */
	public function get_content_html() {
		if ( ! $this->send_pdf ) {
			return $this->get_content_html_no_pdf();
		} else {
			ob_start();
			wc_get_template( $this->template_html, array(
				'invoice' 		=> $this->invoice,
				'order' 		=> $this->object,
				'show_pay_link' => $this->get_option( 'show_pay_link' ),
				'email_heading' => $this->get_heading(),
				'sent_to_admin' => false,
				'plain_text'    => false,
				'email'			=> $this
			) );
			return ob_get_clean();
		}
	}

	public function get_content_html_no_pdf() {
		ob_start();
		wc_get_template( $this->template_html_no_pdf, array(
			'order' 		=> $this->object,
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
		if ( ! $this->send_pdf ) {
			return $this->get_content_plain_no_pdf();
		} else {
			ob_start();
			wc_get_template( $this->template_plain, array(
				'invoice' 		=> $this->invoice,
				'order' 		=> $this->object,
				'show_pay_link' => $this->get_option( 'show_pay_link' ),
				'email_heading' => $this->get_heading(),
				'sent_to_admin' => false,
				'plain_text'    => false,
				'email'			=> $this
			) );
			return ob_get_clean();
		}
	}

	public function get_content_plain_no_pdf() {
		ob_start();
		wc_get_template( $this->template_plain_no_pdf, array(
			'order' 		=> $this->object,
			'email_heading' => $this->get_heading(),
			'sent_to_admin' => false,
			'plain_text'    => true,
			'email'			=> $this
		) );
		return ob_get_clean();
	}

	/**
	 * Initialise settings form fields
	 */
	public function init_form_fields() {

		$this->form_fields = array(
			'enabled' => array(
				'title'   => __( 'Enable/Disable', 'woocommerce-germanized-pro' ),
				'type'    => 'checkbox',
				'label'   => __( 'Enable this email notification', 'woocommerce-germanized-pro' ),
				'default' => 'yes'
			),
			'subject' => array(
				'title'         => __( 'Email Subject', 'woocommerce-germanized-pro' ),
				'type'          => 'text',
				'desc_tip'      => true,
				'description'   => sprintf( __( 'Available placeholders: %s', 'woocommerce-germanized-pro' ), '<code>{invoice_number}, {order_date}, {order_number}</code>' ),
				'placeholder'   => $this->get_default_subject(),
				'default'       => ''
			),
			'heading' => array(
				'title'         => __( 'Email Heading', 'woocommerce-germanized-pro' ),
				'type'          => 'text',
				'desc_tip'      => true,
				'description'   => sprintf( __( 'Available placeholders: %s', 'woocommerce-germanized-pro' ), '<code>{invoice_number}, {order_date}, {order_number}</code>' ),
				'placeholder'   => $this->get_default_heading(),
				'default'       => ''
			),
			'show_pay_link' => array(
				'title'         => __( 'Show pay link', 'woocommerce-germanized-pro' ),
				'type'          => 'checkbox',
				'label'			=> __( 'Enable pay link in Email', 'woocommerce-germanized-pro' ),
				'description'   => __( 'Show order pay link in invoice PDF Email if order status is set to pending.', 'woocommerce-germanized-pro' ),
				'default'       => 'no'
			),
			'subject_no_pdf' => array(
				'title'         => __( 'Email Subject (no PDF)', 'woocommerce-germanized-pro' ),
				'type'          => 'text',
				'desc_tip'      => true,
				'description'   => sprintf( __( 'Available placeholders: %s', 'woocommerce-germanized-pro' ), '<code>{order_date}, {order_number}</code>' ),
				'placeholder'   => $this->get_default_subject( false ),
				'default'       => ''
			),
			'heading_no_pdf' => array(
				'title'         => __( 'Email Heading (no PDF)', 'woocommerce-germanized-pro' ),
				'type'          => 'text',
				'desc_tip'      => true,
				'description'   => sprintf( __( 'Available placeholders: %s', 'woocommerce-germanized-pro' ), '<code>{order_date}, {order_number}</code>' ),
				'placeholder'   => $this->get_default_heading( false ),
				'default'       => ''
			),
			'email_type' => array(
				'title'         => __( 'Email type', 'woocommerce-germanized-pro' ),
				'type'          => 'select',
				'description'   => __( 'Choose which format of email to send.', 'woocommerce-germanized-pro' ),
				'default'       => 'html',
				'class'         => 'email_type wc-enhanced-select',
				'options'       => $this->get_email_type_options(),
				'desc_tip'      => true
			)
		);

	}

}

endif;

return new WC_GZDP_Email_Customer_Invoice_Simple();