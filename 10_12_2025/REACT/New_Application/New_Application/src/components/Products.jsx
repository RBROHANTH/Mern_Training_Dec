import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    CircularProgress,
    Box,
    Rating,
    Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                🛍️ Products Store
            </Typography>
            
            <Grid container spacing={3}>
                {products.map(product => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image}
                                alt={product.title}
                                sx={{ objectFit: 'contain', p: 2, bgcolor: '#f5f5f5' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Chip 
                                    label={product.category} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                                <Typography gutterBottom variant="subtitle1" component="h2" sx={{ fontWeight: 'bold', height: 50, overflow: 'hidden' }}>
                                    {product.title}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Rating value={product.rating?.rate || 0} precision={0.1} size="small" readOnly />
                                    <Typography variant="body2" color="text.secondary">
                                        ({product.rating?.count || 0})
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ${product.price.toFixed(2)}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 2, pt: 0 }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    startIcon={<ShoppingCartIcon />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Add to Cart
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Products;