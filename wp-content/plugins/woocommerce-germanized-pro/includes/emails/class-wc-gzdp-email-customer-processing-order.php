<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'WC_GZDP_Email_Customer_Processing_Order' ) ) :

/**
 * Customer Processing Order Email
 *
 * An email sent to the customer when a new order is received/paid for.
 *
 * @class 		WC_Email_Customer_Processing_Order
 * @version		2.0.0
 * @package		WooCommerce/Classes/Emails
 * @author 		WooThemes
 * @extends 	WC_Email
 */
class WC_GZDP_Email_Customer_Processing_Order extends WC_Email_Customer_Processing_Order {

	/**
	 * Constructor
	 */
	function __construct() {

        // Call parent constructor
		parent::__construct();

		$this->customer_email   = true;

		$this->id               = 'customer_processing_order';
		$this->title            = __( 'Order Processing', 'woocommerce-germanized-pro' );
		
		$this->template_html 	= 'emails/customer-processing-order-pre.php';
		$this->template_plain 	= 'emails/plain/customer-processing-order-pre.php';

		// Remove default actions
		remove_action( 'woocommerce_order_status_pending_to_processing_notification', array( $this, 'trigger' ), 10 );
		remove_action( 'woocommerce_order_status_pending_to_on-hold_notification', array( $this, 'trigger' ), 10 );
	}

	/**
	 * Get email subject.
	 *
	 * @since  3.1.0
	 * @return string
	 */
	public function get_default_subject() {
		return __( 'Your order {order_number} has been received', 'woocommerce-germanized-pro' );
	}

	/**
	 * Get email heading.
	 *
	 * @since  3.1.0
	 * @return string
	 */
	public function get_default_heading() {
		return __( 'Thank you for your order', 'woocommerce-germanized-pro' );
	}
}

endif;

return new WC_GZDP_Email_Customer_Processing_Order();
