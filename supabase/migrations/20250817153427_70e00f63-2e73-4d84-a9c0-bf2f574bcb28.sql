-- Psychology post generation logs
CREATE TABLE psychology_post_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    brand_name VARCHAR(255),
    industry VARCHAR(100),
    psychology_approach VARCHAR(50),
    target_emotions TEXT[],
    platform VARCHAR(20),
    audience_segment VARCHAR(50),
    psychology_score INTEGER,
    engagement_prediction INTEGER,
    conversion_potential DECIMAL(5,2),
    emotional_resonance DECIMAL(5,2),
    generated_content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Psychology performance tracking
CREATE TABLE psychology_post_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID REFERENCES psychology_post_generations(id),
    actual_engagement INTEGER,
    actual_conversions INTEGER,
    performance_score DECIMAL(5,2),
    feedback_rating INTEGER,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Psychology approach effectiveness
CREATE TABLE psychology_approach_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approach_name VARCHAR(50),
    industry VARCHAR(100),
    platform VARCHAR(20),
    average_psychology_score DECIMAL(5,2),
    average_engagement_lift DECIMAL(5,2),
    total_uses INTEGER,
    success_rate DECIMAL(5,2),
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User psychology preferences
CREATE TABLE user_psychology_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    preferred_approach VARCHAR(50),
    preferred_emotions TEXT[],
    default_audience_segment VARCHAR(50),
    psychology_intensity VARCHAR(20) DEFAULT 'moderate',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE psychology_post_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_post_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychology_approach_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_psychology_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for psychology_post_generations
CREATE POLICY "Users can view their own psychology generations" 
ON psychology_post_generations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own psychology generations" 
ON psychology_post_generations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for psychology_post_performance
CREATE POLICY "Users can view performance for their generations" 
ON psychology_post_performance 
FOR SELECT 
USING (generation_id IN (
    SELECT id FROM psychology_post_generations WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create performance data for their generations" 
ON psychology_post_performance 
FOR INSERT 
WITH CHECK (generation_id IN (
    SELECT id FROM psychology_post_generations WHERE user_id = auth.uid()
));

-- RLS Policies for psychology_approach_analytics (read-only for all users)
CREATE POLICY "Users can view analytics data" 
ON psychology_approach_analytics 
FOR SELECT 
USING (true);

-- RLS Policies for user_psychology_preferences
CREATE POLICY "Users can manage their own psychology preferences" 
ON user_psychology_preferences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_psychology_post_generations_updated_at
    BEFORE UPDATE ON psychology_post_generations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_psychology_post_performance_updated_at
    BEFORE UPDATE ON psychology_post_performance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_psychology_preferences_updated_at
    BEFORE UPDATE ON user_psychology_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();