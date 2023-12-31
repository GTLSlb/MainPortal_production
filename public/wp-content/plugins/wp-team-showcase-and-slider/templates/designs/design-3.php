<?php
/**
 * Design 3 Shortcodes HTML
 *
 * @package WP Team Showcase and Slider
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $post; ?>
<div class="<?php echo $css_class.' '.$class;?>">
	<div class="teamshowcase-image-bg">
		<img <?php if( $lazyload ) { ?>data-lazy="<?php echo esc_url( $feat_image ); ?>" <?php } ?> src="<?php if( empty( $lazyload ) ) { echo esc_url( $feat_image ); } ?>" alt="<?php the_title_attribute(); ?>" />
		<?php if( $teampopup == 'true' ) { ?>
			<a class="teamshowcase-hover-icon popup-modal" data-mfp-src="#popup-<?php echo $popup_id. '-' .$i; ?>" href="javascript:void(0);"><i class="fa fa-plus-circle"></i></a>
		<?php } ?>
	</div>

	<div class="member-main-info">
		<div class="member-name"><?php the_title(); ?></div>
		<?php if($member_designation != '' || $member_department!= ''){ ?>
			<div class="member-job"> 
				<?php echo ($member_designation != '' ? $member_designation : '');
				echo ($member_designation != '' && $member_department != '' ? ' - ' : '');
				echo ($member_department != '' ? $member_department : ''); ?>
			</div>
		<?php } ?>
	</div>

	<div class="member-content">
		<div class="member-desc">
			<?php $customExcerpt = get_the_excerpt();
			if (has_excerpt($post->ID)) { ?>
				<?php echo $customExcerpt ; ?>
			<?php } else { 
				the_content(); 
			} ?>
		</div>
		<?php if($skills != '' || $member_experience != '') { ?>
			<div class="other-info">
				<?php echo ($skills != '' ? $skills : '');
					echo ($skills != '' && $member_experience != '' ? ' - ' : '');
					echo ($member_experience != '' ? $member_experience : ''); ?>
			</div>
		<?php } ?>
	</div>

	<?php if($facebook_link != '' || $likdin_link != '' || $twitter_link != '' || $google_link != '') { ?>
		<div class="contact-content">
			<?php if($facebook_link != '') { ?><a href="<?php echo esc_url($facebook_link); ?>" target="_blank"><i class="fa fa-facebook"></i></a> <?php }
				if($likdin_link != '') { ?><a target="_blank" href="<?php echo esc_url($likdin_link); ?>"><i class="fa fa-linkedin"></i></a> <?php } 
				if($twitter_link != '') {?><a target="_blank" href="<?php echo esc_url($twitter_link); ?>"><i class="fa fa-twitter"></i></a> <?php }
				if($google_link != '') { ?><a target="_blank" href="<?php echo esc_url($google_link); ?>"><i class="fa fa-google-plus"></i></a> <?php } ?>
		</div>
	<?php } ?>
</div>