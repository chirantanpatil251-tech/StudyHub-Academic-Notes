import Review from '../models/Review.js';
import Resource from '../models/Resource.js';
import {
  getFallbackReviews,
  getFallbackResources,
} from '../config/store.js';
import { getDbStatus } from '../config/db.js';

// @desc    Add rating and review to a resource
// @route   POST /api/reviews/:resourceId
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (getDbStatus()) {
      const resource = await Resource.findById(resourceId);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      // Create review
      const review = await Review.create({
        resource: resourceId,
        user: req.user._id,
        userName: req.user.name,
        rating: numRating,
        comment,
      });

      // Recalculate average rating
      const reviews = await Review.find({ resource: resourceId });
      const avg = (
        reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
      ).toFixed(1);

      resource.rating = parseFloat(avg);
      resource.totalRatings = reviews.length;
      await resource.save();

      return res.status(201).json({ review, rating: resource.rating, totalRatings: resource.totalRatings });
    } else {
      const resources = getFallbackResources();
      const resource = resources.find((r) => r._id.toString() === resourceId.toString());
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      const newReview = {
        _id: 'rv_' + Date.now() + Math.random().toString(36).substring(2, 6),
        resource: resourceId,
        user: req.user._id,
        userName: req.user.name,
        rating: numRating,
        comment,
        createdAt: new Date(),
      };

      const reviews = getFallbackReviews();
      reviews.unshift(newReview);

      const resourceReviews = reviews.filter((r) => r.resource.toString() === resourceId.toString());
      const avg = (
        resourceReviews.reduce((acc, item) => acc + item.rating, 0) / resourceReviews.length
      ).toFixed(1);

      resource.rating = parseFloat(avg);
      resource.totalRatings = resourceReviews.length;

      return res.status(201).json({ review: newReview, rating: resource.rating, totalRatings: resource.totalRatings });
    }
  } catch (error) {
    console.error('addReview error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a resource
// @route   GET /api/reviews/:resourceId
// @access  Public
export const getResourceReviews = async (req, res) => {
  try {
    const { resourceId } = req.params;

    if (getDbStatus()) {
      const reviews = await Review.find({ resource: resourceId }).sort({ createdAt: -1 });
      return res.json(reviews);
    } else {
      const reviews = getFallbackReviews().filter(
        (r) => r.resource.toString() === resourceId.toString()
      );
      return res.json(reviews);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
