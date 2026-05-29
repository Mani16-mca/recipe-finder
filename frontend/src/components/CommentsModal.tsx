import React, { useState, useEffect } from "react";

const CommentsModal: React.FC<{ recipeId: number; onClose: () => void }> = ({ recipeId, onClose }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current logged-in user
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      console.log("Current user:", user); // Debug log
      setCurrentUser(user);
    }
    
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove the deleted comment from state immediately
        setComments(prevComments => prevComments.filter(c => c._id !== commentId));
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Error deleting comment");
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || newRating === 0) {
      alert("Please provide both a comment and rating");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: newComment,
          rating: newRating
        })
      });

      if (response.ok) {
        setNewComment("");
        setNewRating(0);
        fetchComments();
      } else {
        alert("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting comment");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return (
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isSelected = star <= (interactive ? (hoveredStar || newRating) : rating);
          return (
            <span
              key={star}
              style={{ 
                cursor: interactive ? "pointer" : "default", 
                fontSize: "22px",
                color: isSelected ? "#7c9653" : "#d4e5c4",
                lineHeight: "1",
                transition: "color 0.2s ease"
              }}
              onClick={() => interactive && onStarClick && onStarClick(star)}
              onMouseEnter={() => interactive && setHoveredStar(star)}
              onMouseLeave={() => interactive && setHoveredStar(0)}
            >
              ☆
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "550px",
        maxHeight: "75vh",
        overflowY: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ 
          padding: "16px 24px 12px", 
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#f0f9ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <span style={{ fontSize: "18px" }}>🍃</span>
            </div>
            <div>
              <h3 style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                color: "#1f2937", 
                margin: "0 0 1px 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Comments & Reviews ({comments.length})
              </h3>
              <p style={{ 
                fontSize: "12px", 
                color: "#6b7280", 
                margin: "0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Share your experience with this recipe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              fontSize: "24px",
              color: "#9ca3af",
              padding: "0",
              lineHeight: "1",
              marginTop: "2px"
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 28px 28px", flex: 1, overflowY: "auto" }}>
          {/* Comments List */}
          {comments.length > 0 ? (
            <div style={{ marginBottom: "20px" }}>
              {comments.map((comment, index) => {
                const isOwner = currentUser && comment.userId && String(comment.userId).trim() === String(currentUser._id).trim();
                console.log("Comment userId:", comment.userId, "CurrentUser _id:", currentUser?._id, "Are they equal?:", isOwner);
                return (
                <div 
                  key={comment._id || index} 
                  style={{ 
                    marginBottom: "16px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    const deleteBtn = e.currentTarget.querySelector('.delete-btn') as HTMLElement;
                    if (deleteBtn) {
                      deleteBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const deleteBtn = e.currentTarget.querySelector('.delete-btn') as HTMLElement;
                    if (deleteBtn) {
                      deleteBtn.style.opacity = '0';
                    }
                  }}
                >
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    background: "#9CAF53", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: "#fff", 
                    fontSize: "16px", 
                    fontWeight: "600",
                    flexShrink: 0
                  }}>
                    {comment.userName ? comment.userName.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "#1f2937" }}>
                        {comment.userName || "Admin"}
                      </span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            style={{ 
                              fontSize: "16px", 
                              color: star <= comment.rating ? "#fbbf24" : "#e5e7eb"
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "#4b5563", margin: "0", lineHeight: "1.5" }}>
                      {comment.comment}
                    </p>
                  </div>
                  
                  {/* Delete button - only show for comment owner */}
                  {isOwner && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteComment(comment._id)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        fontSize: "20px",
                        color: "#ef4444",
                        padding: "4px",
                        lineHeight: "1"
                      }}
                      title="Delete comment"
                    >
                      ✕
                    </button>
                  )}
                </div>
                );
              })}
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "20px 20px 16px",
              color: "#6b7280"
            }}>
              {/* Decorative + symbols */}
              <div style={{ position: "relative", marginBottom: "12px", height: "60px" }}>
                {/* Left + */}
                <div style={{ 
                  position: "absolute",
                  left: "50px",
                  top: "2px",
                  fontSize: "12px",
                  color: "#a8d5a3",
                  fontWeight: "300"
                }}>
                  +
                </div>
                
                {/* Right + */}
                <div style={{ 
                  position: "absolute",
                  right: "50px",
                  top: "2px",
                  fontSize: "12px",
                  color: "#a8d5a3",
                  fontWeight: "300"
                }}>
                  +
                </div>

                {/* Speech Bubble */}
                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%"
                }}>
                  <div style={{
                    width: "64px",
                    height: "52px",
                    borderRadius: "18px",
                    border: "2px solid #7c9653",
                    background: "#f5f9f3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}>
                    {/* Three dots inside speech bubble */}
                    <div style={{ display: "flex", gap: "4px" }}>
                      <div style={{ width: "2.5px", height: "2.5px", borderRadius: "50%", background: "#7c9653" }}></div>
                      <div style={{ width: "2.5px", height: "2.5px", borderRadius: "50%", background: "#7c9653" }}></div>
                      <div style={{ width: "2.5px", height: "2.5px", borderRadius: "50%", background: "#7c9653" }}></div>
                    </div>
                    {/* Speech bubble pointer */}
                    <div style={{
                      position: "absolute",
                      bottom: "-6px",
                      right: "12px",
                      width: "0",
                      height: "0",
                      borderLeft: "5px solid transparent",
                      borderTop: "6px solid #f5f9f3",
                      borderRight: "5px solid transparent"
                    }}></div>
                  </div>
                </div>
              </div>
              
              <h4 style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                color: "#1f2937", 
                margin: "0 0 6px 0",
                fontFamily: "'Inter', sans-serif"
              }}>
                No comments yet!
              </h4>
              <p style={{ 
                fontSize: "13px", 
                color: "#6b7280", 
                margin: "0",
                fontFamily: "'Inter', sans-serif",
                lineHeight: "1.4"
              }}>
                Be the first to share your thoughts and review this recipe.
              </p>
            </div>
          )}

          {/* Add Review Section */}
          <div style={{ 
            borderTop: "1px solid #f0f0f0",
            paddingTop: "24px"
          }}>
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px"
            }}>
              <span style={{ fontSize: "16px", color: "#7c9653" }}>✏️</span>
              <h4 style={{ 
                fontSize: "16px", 
                fontWeight: "700", 
                color: "#1f2937", 
                margin: "0",
                fontFamily: "'Inter', sans-serif"
              }}>
                Add Your Review
              </h4>
            </div>
            
            {/* Rating */}
            <div style={{ marginBottom: "16px" }}>
              <span style={{ 
                fontSize: "13px", 
                color: "#6b7280", 
                marginBottom: "8px", 
                display: "block",
                fontWeight: "500"
              }}>
                Your Rating
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                {renderStars(newRating, true, setNewRating)}
              </div>
            </div>

            {/* Comment Input */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <div style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                fontSize: "14px",
                zIndex: 1,
                color: "#7c9653"
              }}>
                🍃
              </div>
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "12px 16px 12px 40px",
                  border: "2px solid #7c9653",
                  borderRadius: "12px",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  resize: "vertical",
                  boxSizing: "border-box",
                  background: "#fff",
                  lineHeight: "1.5"
                }}
              />
              <div style={{
                position: "absolute",
                bottom: "10px",
                right: "12px",
                fontSize: "11px",
                color: "#9ca3af"
              }}>
                {newComment.length}/500
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitComment}
              disabled={loading || !newComment.trim() || newRating === 0}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: loading || !newComment.trim() || newRating === 0 ? "#a8d5a0" : "#6a8347",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading || !newComment.trim() || newRating === 0 ? "not-allowed" : "pointer",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading && newComment.trim() && newRating > 0) {
                  e.currentTarget.style.background = "#5a7339";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && newComment.trim() && newRating > 0) {
                  e.currentTarget.style.background = "#6a8347";
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
