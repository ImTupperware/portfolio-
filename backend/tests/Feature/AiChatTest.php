<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_ai_chat_returns_successful_reply(): void
    {
        $this->seed();

        $response = $this->postJson('/api/v1/ai/chat', [
            'message' => 'Tell me about your core skills and stack',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'reply',
            ])
            ->assertJson([
                'success' => true,
            ]);

        $this->assertNotEmpty($response->json('reply'));
    }

    public function test_ai_chat_validates_empty_message(): void
    {
        $response = $this->postJson('/api/v1/ai/chat', [
            'message' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED')
            ->assertJsonStructure(['error' => ['errors' => ['message']]]);
    }
}
