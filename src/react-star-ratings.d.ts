declare module 'react-star-ratings' {
    import * as React from 'react';

    interface StarRatingsProps {
        rating: number;
        starRatedColor?: string;
        starEmptyColor?: string;
        starHoverColor?: string;
        numberOfStars?: number;
        name?: string;
        changeRating?: (newRating: number) => void;
        starDimension?: string;
        starSpacing?: string;
    }

    export default class StarRatings extends React.Component<StarRatingsProps> { }
}
